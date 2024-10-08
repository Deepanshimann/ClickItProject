const express=require("express");
const passport = require("passport");
const router=express.Router();

router.get("/google",
    passport.authenticate("google",{
scope:["profile","email"],
    }),
);
 router.get("/google/callback",
    passport.authenticate("google",{
        successRedirect:"/products",
        failureRedirect:"/",
    }),
 );


 //written in passport
 router.get("/logout",function(req,res){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect("/");
    });
 })

module.exports=router;