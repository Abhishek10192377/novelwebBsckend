let userregisterModel = require("../../Models/User/userregisterModel");
let Book = require("../../Models/Book");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('../../../App/config/cloudinary');
const { SendVerificationCode } = require("../../Middelware/nodemail");

// User Registration
let Insertregister = async (req, res) => {
    try {
        let { name, email, phone, password } = req.body;
        const Exectingemail = await userregisterModel.findOne({ email })
        if (Exectingemail) {
            return res.status(409).json({ message: "Email is alredy used" });
        }
        const verificationcode = Math.floor(100000 + Math.random() * 90000).toString()
        let registerInfo = new userregisterModel({
            name,
            email,
            phone,
            password,
            verificationcode
        });

        await registerInfo.save();
        SendVerificationCode(email, verificationcode)
        res.status(201).json({ message: "Data inserted successfully", data: registerInfo, email: registerInfo.email });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// User Login
let userLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userregisterModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let match = await password == user.password;
        if (!match) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

let verifyUsernormal = async (req, res) => {
    try {
        const { code } = req.body
        let user = await userregisterModel.findOne({ verificationcode: code })
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        user.isVerified = true;
        user.verificationcode = undefined
        await user.save()
        return res.status(200).json({
            message: "Register Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}


//////////// update user password //////

const userforgetpassword = async (req, res) => {
    try {
       const {email, newpassword} = req.body
        const user = await userregisterModel.findOne({email});
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

////// verify reset otp //////////

const verifyResetOtp = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
      
        const user = await userregisterModel.findOne({ email }).select('+password');

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


// Show Total Users
const getTotalUser = async (req, res) => {
    try {
        const count = await userregisterModel.countDocuments();
        res.json({ totalUser: count });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Add Book to Favourites
const addToFavourite = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const user = await userregisterModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.favouriteBooks.includes(bookId)) {
            return res.status(400).send('Book already in favourites');
        }

        user.favouriteBooks.push(bookId);
        await user.save();

        return res.status(200).send('Book added to favourites');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

// Get User with Favourite Books
const getUserWithFavourites = async (req, res) => {
    const userId = req.user.id;  // id from token

    try {
        // Use the correct model to find the user
        const user = await userregisterModel.findById(userId).populate('favouriteBooks');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            favouriteBooks: user.favouriteBooks,  // Populated book details
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const removeFavourite = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        const user = await userregisterModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isBookInFavourites = user.favouriteBooks.some(book => book.toString() === bookId);
        if (!isBookInFavourites) {
            return res.status(404).send("Book is not in favourites");
        }

        user.favouriteBooks = user.favouriteBooks.filter(book => book.toString() !== bookId);
        await user.save();

        res.status(200).json({
            message: "Favourite book removed successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const addComment = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userregisterModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const { message } = req.body;

        if (!req.file || !message) {
            return res.status(400).send("Image file and message are required");
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'novelWeb'
        });

        const newComment = {
            UserId: userId,
            message,
            image: result.secure_url,
            createdAt: new Date()
        };

        user.comments.push(newComment);
        await user.save();

        res.status(200).json({
            name: user.name,
            comments: user.comments
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send('Server Error');
    }
};

//////////  show user full data /////////

const userfulldata = async (req, res) => {
    try {
        const userdata = await userregisterModel.find().sort({ createdAt: -1 }).limit(20);
        return res.status(200).json({ userdata })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

}
const userfulldataforadmin = async (req, res) => {
    try {
        const userdata = await userregisterModel.find()
        return res.status(200).json({ userdata })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

}
const userdelete = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await userregisterModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({
                status: 0,
                message: "user not found"
            })
        }
        res.status(200).json({
            status: 1,
            message: "user deleted successfully",
            data: deleted,
        })
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Server error while deleting category",
            error: error.message,
        });
    }
}


module.exports = { Insertregister, userLogin, getTotalUser, addToFavourite, getUserWithFavourites, removeFavourite, addComment, userfulldata, userfulldataforadmin, userdelete, verifyUsernormal, userforgetpassword  ,verifyResetOtp };
