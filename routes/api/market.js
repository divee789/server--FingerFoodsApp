const express = require("express"),
    router = express.Router(),
    marketController = require("../../controllers/app"),
    middleware = require("../../middleware/index")


// Get Products
router.get("/", marketController.getProducts)


//Get a specific product
router.post("/product",middleware.verifyToken,marketController.getProductId)



//Add Products
router.post("/",middleware.verifyToken,marketController.createProduct)


//Buy Product
router.post("/buy",middleware.verifyToken,marketController.reqProduct)

//BUY pLENTY
router.post("/cart",middleware.verifyToken,marketController.reqMassProduct)
//Get Orders
router.get("/order",middleware.verifyToken,marketController.getOrders)

//Delete offer
// router.delete("/:id", (req, res) => {
//     Offer.findByIdAndRemove(req.params.id, (err, removed) => {
//         if (err) {
//             console.log("Error in removing")
//         }
//     })
// })


module.exports = router