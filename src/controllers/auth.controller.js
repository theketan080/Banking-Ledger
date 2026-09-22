const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const emailService = require('../services/email.service')
const tokenBlacklistModel = require('../models/blacklist.model')


async function registerController(req,res){

  const {email, password, name} = req.body

  const isEmailVal = await userModel.findOne({email})

  if(isEmailVal){
    return res.status(422).json({
      message:"user already registered",
      status: "Failed"
    })
  }

  const user = await userModel.create({
    email,password,name
  })

  const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3d"});

  res.cookie("token", token)
  
  res.status(201).json({
    message:"User Registered Successfully",
    user:{
      _id:user._id,
      email: user.email,
      name:user.name
    }
  })


  await emailService.sendRegistrationEmail(user.email, user.name)




}

async function loginController(req,res){
  const {email, password} = req.body;

  const isUserExists = await userModel.findOne({email}).select("+password");

  if(!isUserExists){
    return res.status(401).json({
      message:"Please Register First"
    })
  }

  const isValidPass = await isUserExists.comparePassword(password)

  if(!isValidPass){
    return res.status(401).json({
      message:"Invalid Password"
    })
  }


  const token = jwt.sign({userId:isUserExists._id},process.env.JWT_SECRET,{expiresIn:"3d"});

  res.cookie("token", token);

  res.status(200).json({
    message:"User Logged In Successfully",
    isUserExists:{
      _id:isUserExists._id,
      email: isUserExists.email,
      name:isUserExists.name
    }
  })

}

async function userLogoutCountroller(req,res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(200).json({
      message:"User Logout Successfully"
    })
  }

  
  await tokenBlacklistModel.create({
    token:token
  })

  res.clearCookie("token")

  res.status(200).json({
    message:"User Logged Out Successfully"
  })
}

module.exports = {
  registerController,
  loginController,
  userLogoutCountroller
}