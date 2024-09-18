const mongoose = require("mongoose");
const Joi = require("joi");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
}, { timestamps: true });

const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim(),
    });

    return schema.validate(data);
};

module.exports = {
    categoryModel: mongoose.model("category", CategorySchema),
    validateCategory,
};
