const express = require("express"),
    router = express.Router(),
    authController = require("../../controllers/auth"),
    middleware = require("../../middleware/index"),
    User = require('../../models/users'),
    passport=require("passport")



const multer = require('multer'),
    path = require('path')

const storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: filefilter
})
router.post("/upload", middleware.verifyToken, upload.single("file"),async (req, res) => {
   
   await User.findById(req.userId, (err, item) => {
       
        var fs = require('fs');
        if (item.imageUrl !== undefined && item.imageUrl !== "" && req.file.path !== item.imageUrl) {
            fs.unlink(item.imageUrl, () => {
                console.log("unlinked")
            })
        }
    })
    if(req.file){
    var query = req.userId,
        update = { imageUrl: req.file.path },
        options = { upsert: true, new: true, setDefaultsOnInsert: true }
    User.findByIdAndUpdate(query, update, options, function (err, result) {
        console.log(result)
    });
    res.json({ file: req.file })
}
})
//AUTH ROUTES
//==================


router.get("/user", middleware.verifyToken, authController.getUser)

// handle sign up logic
router.post("/register", authController.createUsers)


//handle sign in logic
router.post("/login", authController.logIn)

//Log out logic
router.get("/logout", middleware.verifyToken, authController.logOut)

//Update User
router.put("/update", middleware.verifyToken, authController.editUser)

//Edit Password
router.put("/password", middleware.verifyToken, authController.editPassword)



// // =====================================
//     // FACEBOOK ROUTES =====================
//     // =====================================
//     // route for facebook authentication and login
//     router.get('/auth/facebook', passport.authenticate('facebook', { 
//         scope : ['public_profile', 'email']
//       }));
  
//       // handle the callback after facebook has authenticated the user
//       router.get('/auth/facebook/callback',
//           passport.authenticate('facebook'),(req,res)=>{
//               res.send({message:"successface"})
//           });
module.exports = router