const mongoose = require('mongoose')


function connectDB(){
  mongoose.connect(process.env.MONGODB_URL)
  .then(()=>{
    console.log("db connected succcessfully")
  }).catch((err)=>{
    console.log("error connecting to db");
    process.exit(1);
  })
}

module.exports = connectDB;