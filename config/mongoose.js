require('dotenv').config(); 
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore=require('connect-mongo');
const mongoUrl = process.env.MONGOURL;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process with failure
    }
};

const store=MongoStore.create({
    mongoUrl:process.env.MONGOURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo session store",err);
});

connectDB();
