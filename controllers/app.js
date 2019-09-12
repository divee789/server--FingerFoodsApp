const Product = require("../models/products"),
    User = require("../models/users")




exports.getProducts = (req, res) => {
    Product.find({}, (err, allProducts) => {
        console.log("Finding products");
        if (err) {
            console.log(err)
        } else {
            res.send({
                products: allProducts
            })
        }
    })

},

    exports.getProductId = (req, res, next) => {
        const id = req.body.id
        Product.findById(id, function (err, product) {
            if (err) return res.status(500).send("There was a problem finding this Product");
            if (!product) return res.send("No Product found.");
            res.status(200).send(product);
        })
    },

    exports.reqProduct = (req, res) => {
        Product.findById(req.body._id).then(result => {
            if(!result){
                return res.send('product not found')
            }
            console.log(result)
            User.findById(req.userId,async (err, user) => {
                await user.orders.push(result)
                await user.save()
            res.status(200).send(user)
            })
        })
    },
    exports.reqMassProduct=(req,res)=>{
        console.log(req.body)
        User.findById(req.userId,async (err, user) => {
            let x=user.orders       
            let y=req.body
            Array.prototype.push.apply(x,y);
            user.orders=user.orders
            await user.save()
        res.status(200).send(user)
        })
    }
    exports.getOrders = (req,res)=>{
        User.findById(req.userId).populate({path:"orders"}).exec((err,user)=>{
            res.status(200).send(user.orders)
        })
    },
    exports.createProduct = (req, res) => {
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
            recipe: req.body.recipe,
            units: req.body.units
        }
        Product.create(newProduct, (err, item) => {
            if (err) {
                console.log(err)
            } else {
                res.status(201).send(item)
            }
        })

    }