const router = require('express').Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
})


router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username });

        !user && res.status(200).json("wrong credential");

        const hashedPassword = CryptoJs.AES.decrypt(
            user.password, process.env.PASS_SEC
        );

        const orginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        orginalPassword !== req.body.password && res.status(401).json("wrong cridentail");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            }, 
            process.env.JWT_SEC,
            {
                expiresIn:"3d"
            }
        );
        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});
    } catch (err) {
        console.log(err);
    }
})



module.exports = router;