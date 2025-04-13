const express = require('express');
const router = express.Router()
const cors = require('cors')
const multer = require("multer");
const path = require("path");
const {test,registerUser,forgotpassword,resetpassword,loginUser,getProfile,updateUser,logoutUser} = require('../controllers/authController')
//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

// Multer Storage Setup for File Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
    },
});

const upload = multer({ storage });

router.get('/',test)
router.post('/registerNEW',registerUser)
router.post('/login',loginUser)
router.get('/profile',getProfile)
router.post('/update',upload.single("profilePic"),updateUser)
router.post('/logout', logoutUser);
router.post('/login/ForgotPassword',forgotpassword)
router.post('/resetpassword/:token', resetpassword);

module.exports = router