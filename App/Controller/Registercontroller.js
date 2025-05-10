const { SendVerificationCode } = require("../Middelware/nodemail");
let RegisterModel = require("../Models/Registermodel")
const jwt = require('jsonwebtoken');
let registerInsert = async (req, res) => {
    try {
      let { name, email, password } = req.body;
  
     
      let existingUser = await RegisterModel.findOne({ email });
  
      if (existingUser) {
         res.status(400).json({ message: "Email is already used" });
      }
      const verificationcode = Math.floor(100000 +Math.random()*900000).toString();
      let registerinfo = new RegisterModel({ name, email, password , verificationcode });
  
      await registerinfo.save();
       SendVerificationCode(email,verificationcode)
       res.status(201).json({ message: "Registration successful", registerinfo });
    } catch (error) {
          res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  let loginInset = async (req, res) => {
    try {
        const {email ,password} = req.body
        let user = await RegisterModel.findOne({email}).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let match = password === user.password; // Note: This should be hashed comparison in production
        if (!match) {
            return res.status(401).json({ message: "Email or password does not match!" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

let verifyUser = async (req, res) => {
        try {
            const {code} = req.body
            let user = await RegisterModel.findOne({ verificationcode:code});
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.isVerified = true;
            user.verificationcode=undefined
            await user.save();
    
            return res.status(200).json({
                message: "Admin Register Successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
    
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
}
//////////  //////////// update user password //////
const registerforgetpassword = async (req, res) => {
    try {
       const {email, newpassword} = req.body
        const user = await RegisterModel.findOne({email});
        if (!user) {
            return res.status(404).json({
                status: 0,
                message: "user not found"
            })
        }

        const resetOtp = Math.floor(100000 + Math.random()*900000).toString()
        user.resetOtp = resetOtp
        user.resetOtpExpires = new Date(Date.now()+5*60*1000)
        await user.save()
        SendVerificationCode(email, resetOtp)
        res.status(200).json({
            message: "otp sent to email",
        })
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Server error while updating Password",
            error: error.message,
        })
    }
}

const registerverifyResetOtp = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
      
        const user = await RegisterModel.findOne({ email }).select('+password');

        if (!user || String(user.resetOtp) !== String(otp) || Date.now() > user.resetOtpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = password; 
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;


        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerInsert, loginInset , verifyUser, registerforgetpassword ,registerverifyResetOtp};