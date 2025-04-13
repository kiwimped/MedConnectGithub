const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');
const NotificationModel = require('../models/notify')
const nodemailer = require('nodemailer');
const multer = require("multer");
const path = require("path");

const test = (req, res) => {
    res.json('test is working')
}

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
//register endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password, isDoctor,termAgree,specialty,location,experience } = req.body;
        // check if name entered
        if (typeof isDoctor !== 'boolean') {
            return res.status(400).json({
                error: 'isDoctor field is required and must be a boolean'
            });
        }
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }
        // check if password entered
        if (!password || password.length < 6) {
            return res.json({
                error: 'password is required, need 6 characters long'
            })
        }
        // check if email entered
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({
                error: 'email is taken'
            })
        }

        const hashedPassword = await hashPassword(password)


        //Create user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isDoctor,
            termAgree,
            specialty,
            location,
            experience
        })
        // Add a notification for the new user
        const notification = await NotificationModel.create({
            userId: user._id,
            message: `Welcome, ${user.name}! Your account has been successfully created.`,
        });

        return res.status(201).json({ user, notification });



    } catch (error) {
        console.log(error)
    }
}
//login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: 'No user found' });
        }

        const match = await comparePassword(password, user.password);

        if (match) {
            // Generate JWT
            const token = jwt.sign(
                { email: user.email, id: user._id, name: user.name, isDoctor: user.isDoctor },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }  // Optionally set an expiry for the token
            );

            // Send the cookie
            res.cookie('token', token, {
                httpOnly: true, // Ensures the cookie is not accessible via JavaScript
                secure: false, // Set to true if using HTTPS
                sameSite: 'Lax', // Prevent CSRF attacks
            }).json(user);

        } else {
            return res.json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getProfile = (req, res) => {
    console.log("Cookies received:", req.cookies); // Debugging

    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedUser) => {
            if (err) throw err;

            // Fetch the full user details if needed
            const user = await User.findById(decodedUser.id).select('name email isDoctor');
            if (user) {
                res.json(user); // Include isDoctor
            } else {
                res.json(null);
            }
        });
    } else {
        res.json(null)
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, password,specialty,location,experience } = req.body;
        const { token } = req.cookies;
        const profilePic = req.file ? `/uploads/${req.file.filename}` : null;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
                if (err) {
                    return res.json({ error: 'Invalid or expired token' });
                }

                const user = await User.findById(decodedUser.id)
                if (!user) {
                    return res.json({ error: 'User not found' });
                }
                // Update user data
                if (name) {
                    user.name = name;
                }

                if (password) {
                    // Hash new password
                    user.password = await hashPassword(password);
                }

                if(specialty) {
                    user.specialty = specialty;
                }

                if(location) {
                    user.location = location;
                }

                if(experience){
                    user.experience = experience;
                }
                if(profilePic) user.profilePic = profilePic;

                await user.save(); // Save the updated user

                return res.json(user);
            })
        } else {
            return res.json({ error: 'No token found, Login please.' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
}

const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'Lax',
    });
    return res.json({ message: 'Logged out successfully' });
};
const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;  // Include token
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `Click the link to reset your password: ${resetLink}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log('Email sent:', info.response);
                return res.json({ message: 'Password reset email sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error in forgotpassword function:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const bcrypt = require('bcrypt'); // Ensure bcrypt is required

const resetpassword = async (req, res) => {
    try {
        const { token } = req.params; // Get token from URL
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();

            return res.json({ message: 'Password reset successful' });
        });

    } catch (error) {
        console.error('Error in resetpassword:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    logoutUser,
    forgotpassword,
    resetpassword
}