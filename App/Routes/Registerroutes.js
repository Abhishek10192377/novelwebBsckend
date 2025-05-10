let express = require("express")
const { registerInsert ,loginInset,verifyUser, registerforgetpassword,registerverifyResetOtp} = require("../Controller/Registercontroller")
let Registerroutes = express.Router()

Registerroutes.post("/insert",registerInsert)
Registerroutes.post("/login",loginInset)
Registerroutes.post("/verify",verifyUser)
Registerroutes.post("/forget", registerforgetpassword)
Registerroutes.post("/verifyotp",registerverifyResetOtp)
module.exports = Registerroutes;