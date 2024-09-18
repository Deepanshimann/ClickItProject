const express=require("express");
const router=express.Router();
const {cartModel}=require("../models/cart");
const { userLoggedIn } = require("../middlewares/admin");
const {productModel} = require("../models/product");

router.get("/", userLoggedIn, async function (req, res) {
    try {
        // Fetch the cart for the logged-in user and populate the product details
        let cart = await cartModel
            .findOne({ user: req.session.passport.user })
            .populate("products");

        let cartItemQuantity = {};

        // Organize the cart items and aggregate quantities if the same product is added more than once
        if (cart && cart.products.length > 0) {
            cart.products.forEach((product) => {
                let key = product._id.toString();
                if (cartItemQuantity[key]) {
                    cartItemQuantity[key].quantity += 1;
                } else {
                    cartItemQuantity[key] = {
                        ...product._doc,
                        quantity: 1,
                    };
                }
            });
        }

        let finalArry = Object.values(cartItemQuantity);
        let totalPrice = finalArry.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);

        let finalprice = (totalPrice + 5).toFixed(2); // Add a handling fee of 5 units

        // Fetch random products for the "Before You Checkout" section
        let rnproducts = await productModel.aggregate([{ $sample: { size: 4 } }]);

        // Check if the user is logged in
        let userLoggedIn = !!req.session.passport;
        // Render the cart page with cart details, random products, and user information
        res.render("cart", {
            cart: finalArry,
            finalprice: finalprice,
            userid: req.session.passport.user,
            rnproducts,
            cartCount: cart ? cart.products.length : 0  ,// Pass cart count to template
            userLoggedIn ,
           
        });
    } catch (err) {
        res.send(err.message);
    }
});

//Add items to cart 
router.get("/add/:id",userLoggedIn,async function(req,res){
    try{
      let cart=await cartModel.findOne({user: req.session.passport.user}).populate('products'); 
      let product=await productModel.findOne({_id: req.params.id});
     if(!cart){
          // If cart doesn't exist, create a new cart for the user
        cart=await cartModel.create({
            user:req.session.passport.user,
            products:[req.params.id],
            totalPrice:Number(product.price)
        });
     }else{
         // If cart exists, add the product to the cart and update the total price
        cart.products.push(req.params.id);
        cart.totalPrice=Number(cart.totalPrice)+Number(product.price);
        await cart.save();
      
     }
// Return a JSON response with the updated cart count and newly added product details
 res.json({ message: 'Item added to the cart', 
    cartCount: cart.products.length,
 });
    }catch(err){
        res.send(err.message);
    }
    });

//Remove items from cart  through - button
router.get("/remove/:id",userLoggedIn,async function(req,res){
    try{
      let cart=await cartModel.findOne({user: req.session.passport.user});
      let product=await productModel.findOne({_id: req.params.id});
     if(!cart){
       return res.send("There is nothing in the cart");
     }else{
       let prodId=cart.products.indexOf(req.params.id);
       cart.products.splice(prodId,1);
        cart.totalPrice=Number(cart.totalPrice) - Number(product.price);
        await cart.save();
     }
     res.redirect("back");

    }catch(err){
        res.send(err.message);
    }
    });

// remove items from cart
    router.get("/remove/:id",async function(req,res){
       try{
        let cart=await cartModel.findOne({user: req.session.passport.user});
        if(!cart) return res.send("Something went wrong while removing item.");
        let index=cart.products.indexOf(req.params.id);
        if(index !== -1)cart.products.splice(index,1);
        else return res.send("item is not in the cart.");
        await cart.save();
        res.send("item removed successfully");
       }catch(err){
       res.send(err.message);
       }
    })

// Handle the address selection from the map
router.post("/address", userLoggedIn, async function(req, res) {
    try {
        const { address } = req.body;

        // Find the cart for the logged-in user
        let cart = await cartModel.findOne({ user: req.session.passport.user });

        if (!cart) {
            return res.send("Cart not found");
        }

        // Save the address to the cart
        cart.address = address;
        await cart.save();

        // Redirect the user to the cart page after address submission
        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});


module.exports=router;