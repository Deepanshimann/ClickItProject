require("dotenv").config(); // Load environment variables
const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const passport = require("passport");
const authRouter=require("./routes/auth");
const adminRouter=require("./routes/admin");
const productRouter=require("./routes/product");
const categoriesRouter=require("./routes/categories");
const usersRouter=require("./routes/user");
const cartRouter=require("./routes/cart")
const paymentRouter=require("./routes/payement")
const orderRouter=require("./routes/order")
const expressSession=require("express-session");
const path=require("path");
const cookieParser = require("cookie-parser");
require("./config/mongoose"); // Connect to MongoDB
require("./config/passporta");

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    expressSession({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SESSION_SECRET || '3456789_sdfghjk', // Added fallback
    cookie: {
            maxAge:  24*60*60*1000, // 24 hours in milliseconds
        secure: false,  // Set to true if you're using HTTPS
    },
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin",adminRouter);
app.use("/products",productRouter);
app.use("/categories",categoriesRouter);
app.use("/users",usersRouter);
app.use("/cart",cartRouter);
app.use("/payment",paymentRouter);
app.use("/order",orderRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
