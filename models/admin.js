const mongoose = require("mongoose");
const Joi = require("joi");

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin"], // Example roles
        trim: true,
    },
}, { timestamps: true });

const validateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid( "admin").required().trim(),
    });

    return schema.validate(data);
};

module.exports = {
    adminModel: mongoose.model("admin", AdminSchema),
    validateAdmin,
};
