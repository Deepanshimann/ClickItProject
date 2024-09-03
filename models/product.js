const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30,
    },
    stock: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    image: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(2).max(30).required().trim(),
        stock: Joi.boolean().required(),
        description: Joi.string().max(500).trim(),
        image: Joi.string().trim(),
    });

    return schema.validate(data);
};

module.exports = {
    productModel: mongoose.model("product", ProductSchema),
    validateProduct,
};
