const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "abhisheksahni0077@gmail.com",
    pass: "gqxl zysk xuvi norm",
  },
});



const SendVerificationCode = async(email,verificationcode)=>{
    try {
        const response = await transporter.sendMail({
            from: '"NovelWeb 👻" <abhisheksahni0077@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Your Verification Code", // Subject line
            text: `Your verification code is: ${verificationcode}`, // plain text body
            html: `<p>Your verification code is: <b>${verificationcode}</b></p>`, // html body
          });
          return (response);
          
    } catch (error) {
        return (error)
        
    }
}
module.exports = { SendVerificationCode}