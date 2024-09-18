const express=require("express");
const router=express.Router();
const {validateAdmin} = require("../middlewares/admin.js");
const {categoryModel,validateCategory}=require("../models/category.js");


// Route to create a new category
router.post("/create", validateAdmin, async function(req, res) {
    const { name } = req.body;
    try {
        let existingCategory = await categoryModel.findOne({ name: name });
        if (!existingCategory) {
            await categoryModel.create({ name });
            res.redirect("/admin/dashboard?message=Category created successfully");
        } else {
            res.redirect("/admin/dashboard?error=Category already exists");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});



router.post("/update", validateAdmin, async function(req, res) {
    const { currentName, newName } = req.body;
    const normalizedNewName = newName.toLowerCase(); // Normalize new name
    try {
        const existingCategory = await categoryModel.findOne({ name: currentName });
        if (existingCategory) {
            const nameExists = await categoryModel.findOne({ name: normalizedNewName });
            if (nameExists) {
                res.redirect("/admin/dashboard?error=New category name already exists");
            } else {
                existingCategory.name = normalizedNewName;
                await existingCategory.save();
                res.redirect("/admin/dashboard?message=Category updated successfully");
            }
        } else {
            res.redirect("/admin/dashboard?error=Category not found");
        }
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Internal Server Error");
    }
});



// Route to delete a category by name
router.post("/delete", validateAdmin, async function(req, res) {
    const { name } = req.body;  
    try {
        const category = await categoryModel.findOne({ name: name });
        if (category) {
            await categoryModel.deleteOne({ name: name });
            res.redirect("/admin/dashboard?message=Category deleted successfully");
        } else {
            res.send("Category not found");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Failed to delete category");
    }
});

module.exports=router;