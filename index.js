const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');


const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>console.log("connected "))
    .catch((err)=>console.log(err));


app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);


app.listen(5000, () => {
    console.log("back server on")
})