const mongoose = require("mongoose");
const Joi = require("joi");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    price: {
        type:SchemaTypes.Double,
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
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    image: {
        type: Buffer,
    },
}, { timestamps: true });

const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim(),
        price: Joi.number().min(0).precision(2).required(),
        category: Joi.string().min(2).max(30).required().trim(),
        stock: Joi.number().required(),
        description: Joi.string().max(500).trim(),
        image: Joi.any(),
    });

    return schema.validate(data);
};

module.exports = {
    productModel: mongoose.model("product", ProductSchema),
    validateProduct,
};
