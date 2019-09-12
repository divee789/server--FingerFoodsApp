const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    fullname: String,
    password: String,
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    email: String,
    imageUrl: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

userSchema.plugin(passportLocalMongoose)
var User = mongoose.model("User", userSchema)

module.exports = User