const express=require("express");
const router=express.Router();
const {adminModel}=require("../models/admin");
const {productModel}=require("../models/product")
const {categoryModel}=require("../models/category")
const bcrypt=require("bcrypt");
const jwt =require("jsonwebtoken");
const {validateAdmin} = require("../middlewares/admin");
require("dotenv").config();

if(typeof process.env.NODE_ENV !== undefined && 
    process.env.NODE_ENV === "DEVELOPMENT"){
console.log("in dev mode");

try{
    router.get("/create", async function(req,res){

        let salt=await bcrypt.genSalt(10); 
        let hash=await bcrypt.hash("admin",salt);  
       
        let user= new adminModel({
           name:"Abhi",
           email:"abhi100@gmail.com",
           password:hash,
           role:"admin"
       });
       await user.save();
       
       let token=jwt.sign({email:"abhi100@gmail.com",admin:true},
        process.env.JWT_KEY);
       res.cookie("token",token)
       res.send("admin created successfully")
       })  
}  catch(err){
    res.send(err.message);
}
}

router.get("/login",function(req,res){
    res.render("admin_login")
})

//Admin login
router.post("/login",async function(req,res){
   let {email,password}=req.body;
   let admin=await adminModel.findOne({email});
if(!admin) return res.send("this admin is not available");
//check password
let valid=await bcrypt.compare(password,admin.password);
if(valid){
    let token=jwt.sign({email:"abhi100@gmail.com",admin:true},
        process.env.JWT_KEY);
    res.cookie("token", token, { httpOnly: true, path: '/' });
    res.redirect("/admin/dashboard");
}
})

//Admin Dashboard
router.get("/dashboard",validateAdmin,async function(req,res){
   let prodcount=await productModel.countDocuments();
   let categories = await categoryModel.find({}); 
   let categcount=await categoryModel.countDocuments();
   res.render("admin_dashboard",{prodcount,categcount,categories,query: req.query});
})

//Admin Products Route--> where we can see all products that admin create
router.get("/products",validateAdmin,async function(req,res){
    const result = await productModel.aggregate([
        {
          $group: {
            _id: "$category",
            products: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            products: { $slice: ["$products", 10] }
          }
        },
      ]);
      //convert array into object
      const resultObject=result.reduce((acc,item)=>{
        acc[item.category]=item.products;
        return acc;
      },{});
      
      console.log(result);
      
    res.render("admin_products",{products:resultObject})
})

//Logout Admin Panel
router.get("/logout",validateAdmin,function(req,res){
    res.cookie("token","");
    res.redirect("/admin/login");
})



module.exports=router;