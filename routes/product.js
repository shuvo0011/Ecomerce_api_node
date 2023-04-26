const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require("../models/Product");
const router = require('express').Router();


router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json(err);
    }
})


router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Peoduct.findByIdAndDelete(req.params.id);
        res.status(200).json("Peoduct has benn deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Peoduct.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})


router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qcatefory],
                },
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})


// router.get("/stats",verifyTokenAndAdmin, async (req, res)=>{
//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

//     try{
//         const data = await User.aggregate([
//             {$match : {createdAt : {$gte:lastYear }}},
//             {
//                 $project:{
//                     month:{ $month : "$createdAt"}
//                 }
//             },
//             {
//                 $group : {
//                     _id : "$month",
//                     total : { $sum: 1}
//                 }
//             }
//         ]);
//         res.status(500).json(data);
//     }catch(err){
//         res.status(500).json(err);
//     }
// })



module.exports = router;