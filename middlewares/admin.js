const jwt=require("jsonwebtoken");
require("dotenv").config();

async function validateAdmin(req,res,next){
   try{
    console.log(req.cookies);
    let token=req.cookies.token;
  if(!token) return res.send("You need to login first!");
  
    let data= jwt.verify(token,"asdfghjkl12345678");
    req.user=data;
    next();
   }catch(err){
    res.send(err.message);
    console.log(err.message); 
   }
}

async function userLoggedIn(req,res,next){
  console.log("Route hit! Authenticated:", req.isAuthenticated());
  if(req.isAuthenticated()) return next();
  res.redirect("/users/login");
}

module.exports= {validateAdmin,userLoggedIn};