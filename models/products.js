const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: String,
    recipe: String,
    price:Number,
    units:Number
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product