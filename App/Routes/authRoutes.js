const express = require("express");
const auth = require("../Middelware/auth")
const protectedrouter = express.Router();

protectedrouter.get('/protected',auth,(req,res)=>{
  res.json({
    message: "This is protected data",
    user: req.user
  });
})



module.exports = protectedrouter ;
