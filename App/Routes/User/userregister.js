const express = require("express");
const authMiddleware = require("../../Middelware/auth");
const { Insertregister, userLogin, getTotalUser, addToFavourite, getUserWithFavourites ,removeFavourite, addComment, userfulldata ,userfulldataforadmin ,userdelete, verifyUsernormal,userforgetpassword, verifyResetOtp} = require("../../Controller/User/userregisterController");
const upload = require("../../Middelware/multer");

const UserregisterRouter = express.Router();

UserregisterRouter.post('/userregister/insert', Insertregister);
UserregisterRouter.post('/userlogin/insert', userLogin);
UserregisterRouter.get('/usertotal/show', getTotalUser);
UserregisterRouter.post('/passworforget',userforgetpassword)
UserregisterRouter.post('/Adduserfavroute', authMiddleware, addToFavourite);
UserregisterRouter.get('/userfavrouteshow',authMiddleware,  getUserWithFavourites);
UserregisterRouter.delete('/userfavrouteremove',authMiddleware,removeFavourite)
UserregisterRouter.post('/usercomment', authMiddleware, upload.single("file"), addComment);
UserregisterRouter.get('/userdatashow',userfulldata)
UserregisterRouter.get('/userdatashowADMIN',userfulldataforadmin)
UserregisterRouter.delete('/userdelete/:id',userdelete)
UserregisterRouter.post('/userverify',verifyUsernormal)
UserregisterRouter.post('/userforgetotp',verifyResetOtp)
module.exports = UserregisterRouter;
