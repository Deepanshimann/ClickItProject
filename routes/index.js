const express=require("express");
const router=express.Router();

// Redirect root "/" to "/products"
router.get("/", function(req, res) {
    res.redirect("/products");
});

router.get("/map/", function(req,res){
    const user = req.session.passport ? req.session.passport.user : null;
    const userLoggedIn = !!user;  // Convert to boolean indicating if the user is logged in

    res.render('map', {
        userLoggedIn,  // Pass the userLoggedIn flag to the view
        orderid:"req.params.orderid"  // Add any other data you need, like orderid
    });
    // res.render("map",{orderid:req.params.orderid});
});

module.exports=router;