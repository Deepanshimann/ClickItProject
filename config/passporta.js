require('dotenv').config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport=require("passport")
 const {userModel}=require("../models/user");



passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL:
    process.env.NODE_ENV === "production"
    ? "https://click-it-and-buy.onrender.com/auth/google/callback" 
    : "http://localhost:3000/auth/google/callback", 
  },
  async function(accessToken, refreshToken, profile, cb) {
  try{
let user= await userModel.findOne({email:profile.emails[0].value})
if(!user){
    user=new userModel({
        name:profile.displayName,
        email:profile.emails[0].value,
    });
    await user.save();
}
return cb(null,user);

  }catch(err){
 return cb(err,false);
  }
  }
));
//id will be saved to session coz of this
passport.serializeUser(function(user,cb){
    return cb(null,user._id);
});

//we can disclose data coz of this
passport.deserializeUser(async function (id,cb){
    let user=await userModel.findOne({_id:id});
    return cb(null,user);
})
module.exports=passport;