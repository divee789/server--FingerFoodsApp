const User = require("../models/users"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require("../config/config"),
    nodemailer = require("nodemailer"),
    sendgridTransport = require('nodemailer-sendgrid-transport')

const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.SENDGRID_KEY
    }
}))



exports.getUser = (req, res, next) => {
    User.findById(req.userId, { password: 0 }).populate('orders').exec(function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.send("No user found.");

        res.status(200).send(user);
    })
},

exports.createUsers = (req, res) => {
    console.log(req.body)
    const newUser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    };
    User.findOne({ email: req.body.email }).then(item => {
        if (item) {
            return res.status(400).send('A user with the given email is already registered')
            }
        User.findOne({ username: req.body.username }).then(item => {
            if (item) {
                return res.status(400).send('A user with the given username is already registered')
            } else {
                User.create(newUser, (err, user) => {
                    if (err) {
                        return res.status(500).send("There was a problem registering the user.")
                    }
                     transporter.sendMail({
                            to:req.body.email,
                            from:"admin@alphaReact.com",
                            subject:"SignUp Successful!!",
                            html:"<h1>Welcome to alphaReact</h1><p>Wishing you a magnificent User experience</p>"
                        })
                        res.status(200).send('Your profile has been created successfully');
                })
            }
        })
    })
},
exports.editUser = (req, res) => {
    
    const newUser = {
        username: req.body.username,
        email: req.body.email,
    };
    
    User.findByIdAndUpdate(req.userId, newUser, (err, updatedUser) => {
        if (err) {
            console.log("update", err)
            return res.send("Error in Updating User")
        } else {
            return res.send({ user: updatedUser, message: "Profile Updated Successfully" })
        }
    })
},
exports.editPassword = (req,res)=>{
    const password = {
        password: bcrypt.hashSync(req.body.newPassword, 8)
    }
    User.findById(req.userId,(err,user)=>{
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(passwordIsValid){
            User.findByIdAndUpdate(req.userId,password,(err,up)=>{
                if(err){
                   return res.send("Error in Changing Password")
                }  else{
                    return res.send("Password Changed Successfully")
                }
            })
        } else{
            return res.send("Password not Valid")
        }
    })
}
exports.logIn = (req, res) => {
    User.findOne({ email: req.body.email }).populate({path:"orders"}).exec((err, user) => {
        if (err) {
           return res.status(500).send('Error on the server.')
        }
        if (!user) {
            return res.status(400).send("The email given does not exist");
        }
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(400).send({ auth: false, message: "Password not valid" })
        }
        let token = jwt.sign({ id: user.id }, config.secret, {
             expiresIn: 86400 // expires in 24 hours
        })
        res.status(200).send({ auth: true, token: token, user: user, expiresIn: 86400 });
    })
},
exports.logOut = (req, res) => {
    res.status(200).send({ auth: false, token: null });
}