const transactionModel = require('../models/transaction.model')
const accountmodel = require('../models/account.model')
const ledgerModel = require('../models/ledger.model')
const emailService = require('../services/email.service')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose');

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 *   1. Validate request
 *   2. Validate idempotency key
 *   3. Check account status
 *   4. Derive sender balance from ledger
 *   5. Create transaction (PENDING)
 *   6. Create DEBIT ledger entry
 *   7. Create CREDIT ledger entry
 *   8. Mark transaction COMPLETED
 *   9. Commit MongoDB session
 *  10. Send email notification
 */

async function createTransaction(req,res){

  // 1. Validate Request

  const {fromAccount,toAccount,amount,idempotencyKey} = req.body

  if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:"FromAccount, toAccount, amount, idempotency key is required"
    })
  }

  const fromUserAccount = await accountModel.findOne({_id:fromAccount})

  const toUserAccount = await accountModel.findOne({_id:toAccount})

  if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
      message:"Invalid FromAccount or toAccount"
    })
  }

  // 2. Validate idempotency key

  const isTransactionAlreadyExists = await transactionModel.findOne({idempotencyKey:idempotencyKey})

  if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status === "COMPLETED"){
      return res.status(200).json({
        message:"Transaction Already Processed",
        transaction: isTransactionAlreadyExists
      })
    }

    if(isTransactionAlreadyExists.status === "PENDING"){
      return res.status(200).json({
        message: "Transaction is still processing",

      })
    }

    if(isTransactionAlreadyExists.status === "FAILED"){
      return res.status(500).json({
        message: "Transaction Failed, Please Retry"
      })
    }

    if(isTransactionAlreadyExists.status === "REVERSED"){
     return res.status(500).json({
        message:"Transaction Reversed, Please Retry"
      })
    }
  }

  //3. Check account status

  if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
      message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
    })
  }

   // 4. Derive sender balance from ledger

   const balance = await fromUserAccount.getBalance()

   if(balance < amount){
    return res.status(400).json({
      message:`Insufficient Balance.Current balance is ${balance}. Requested Amount is ${amount}`
    })
   }


   //5. Create Transaction (PENDING)
   
   const session = await mongoose.startSession()
   session.startTransaction()

   const transaction = await transactionModel.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
   },{session})

   const debitLedgerEntry = await ledgerModel.create({
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
   },{session})

   const creditLedgerEntry = await ledgerModel.create({
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
   },{session})

   transaction.status = "COMPLETED"
   await transaction.save({session})

   await session.commitTransaction()
   session.endSession()

   //10. Send Email Notification

   await emailService.sendTransactionEmail(
    req.user.email, req.user.name, amount, toAccount
   )

   return res.status(201).json({
    message:"Transaction Completed Successfully",
    transaction: transaction
   })


}

async function createInitialFundsTransaction(req,res){
  const {toAccount,amount,idempotencyKey} = req.body

  if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:"toAccount, amount and idempotencyKey are required"
    })
  }

  const toUserAccount = await accountModel.findOne({
    _id:toAccount
  })

  if(toUserAccount){
    return res.status(400).json({
      message:"Invalid toAccount"
    })
  }

  const fromUserAccount = await accountModel.findOne({
    systemUser: true,
    user: req.user._id
  })

  if(!fromUserAccount){
    return res.status(400).json({
      message:"system user account not found"
    })
  }

  const session = await mongoose.startSession()
  session.startTransaction()


  const transaction = new transactionModel({
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
  },{session})

  const debitLedgerEntry = await ledgerModel.create([{
    account: fromUserAccount._id,
    amount: amount,
    transaction: transaction._id,
    type:"DEBIT"
  }],{session})

  const creditLedgerEntry = await ledgerModel.create([{
    account: toAccount,
    amount: amount,
    transaction: transaction._id,
    type:"CREDIT"
  }],{session})

  transaction.status = "COMPLETED"
  await transaction.save({session})

  await session.commitTransaction()
  session.endSession()

  return res.status(201).json({
    message:"Initial funds transaction completed successfully",
    transaction:transaction
  })

}
module.exports = {
  createTransaction,
  createInitialFundsTransaction
}


