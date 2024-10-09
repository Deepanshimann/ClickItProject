const express=require("express");
const router=express.Router();
const {productModel,validateProduct}=require("../models/product");
const upload=require("../config/multer.js");
const {validateAdmin, userLoggedIn} = require("../middlewares/admin.js");
const {categoryModel}=require("../models/category.js");
const { cartModel } = require("../models/cart.js");
const {userModel}=require("../models/user.js")

// Index Route
router.get("/", async function (req, res) {
  let user = req.session.passport ? req.session.passport.user : null;
  let cartCount = 0; // Default cart count to 0

  try {
    // Fetch products by category
    const result = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          products: { $slice: ["$products", 10] }, //  10 products per category
        },
      },
    ]);

    // If user is logged in, fetch cart details
    if (user) {
      const cart = await cartModel.findOne({ user: user });
      cartCount = cart ? cart.products.length : 0;
    }

    // Fetch random products for the "Order Now" section
    const rnproducts = await productModel.aggregate([{ $sample: { size: 5 } }]);

    // Convert the result array into an object with categories as keys
    const productsByCategory = result.reduce((acc, item) => {
      acc[item.category] = item.products;
      return acc;
    }, {});

    // Render the index page
    res.render("index", {
      products: productsByCategory,
      rnproducts,
      cartCount,
      userLoggedIn: !!user, // Boolean flag to indicate if user is logged in
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.render("errorPage", {
      message: "An error occurred while fetching products. Please try again.",
    });
  }
});

// Error Page route
router.get("/errorPage", (req, res) => {
  res.render("errorPage", { message: "Please log in again to access this page." });
});

//Create Products
router.post("/", upload.single('image'),async function (req,res){
    let {name,price,category,stock,description,image}=req.body;
 // Validate the incoming product details
   let{error}=validateProduct({
    name,
    price,
    category,
    stock,
    description,
    image ,
   });
  
   if(error)return res.send(error.message);

 // Check if the category exists, if not create it
   let isCategory=await categoryModel.findOne({ name: category });
  if(! isCategory){
 // Create new category if not found
 isCategory = await categoryModel.create({ name: category });
  }
// Create the product
let product= await productModel.create({
    name,
    price,
    category,
    image:req.file.buffer,
    description,
    stock,
   });
   res.redirect("/admin/products");
})

//Delete admin products 
router.get("/delete/:id",validateAdmin, async function(req,res){
   if(req.user.admin){
    let prods=await productModel.findOneAndDelete({_id:req.params.id});
    return res.redirect("/admin/products");
   }
    res.send("You are not allowed to delete this product!")
});

//Delete product through product id
router.post("/delete",validateAdmin, async function(req,res){
    if(req.user.admin){
     let prods=await productModel.findOneAndDelete({_id:req.body.product_id});
     return res.redirect("/admin/products");
    }
     res.send("You are not allowed to delete this product!")
 });



 router.get("/search", async function (req, res) {
  const query = req.query.q; 
  try {
    // Find products that match the search query 
    let searchResults = await productModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }, // Search by category name
      ],
    });

    // fetch random products for suggestions on the search page
    let rnproducts = await productModel.aggregate([{ $sample: { size: 8 } }]);
 
 let userLoggedIn = !!req.session.passport; 

    let cart = await cartModel.findOne({ user: req.session.passport ? req.session.passport.user : null });
    let cartCount = cart ? cart.products.length : 0;

    // Render the search results page
    res.render("searchResult",
       {
         searchResults, 
         rnproducts,
          searchTerm: query ,
          cartCount,
          userLoggedIn 
        });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Something went wrong during the search. Please try again.");
  }
});



module.exports=router;