const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const authRouter=require("./routes/auth");
const expressSession=require("express-session");
const path=require("path");
require("dotenv").config(); // Load environment variables
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
})
);

app.use("/", indexRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
