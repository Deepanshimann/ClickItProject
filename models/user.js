const mongoose = require("mongoose");
const Joi = require("joi");

const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    zip: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 225,
    },
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 20,
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
        phone: {
            type: String, // Changed to String to accommodate validation pattern
            required: true,
            match: /^[0-9]{10}$/, // Validate 10-digit phone number
            unique: true,
        },
        addresses: {
            type: [AddressSchema],
            validate: [arrayLimit, '{PATH} exceeds the limit of 5 addresses'],
        },
    },
    { timestamps: true }
);

// Custom validator to limit the number of addresses
function arrayLimit(val) {
    return val.length <= 5;
}

const validateUser = (data) => {
    const addressSchema = Joi.object({
        state: Joi.string().min(2).max(20).required().trim(),
        zip: Joi.string().required().trim(),
        city: Joi.string().min(2).max(20).required().trim(),
        address: Joi.string().min(7).max(225).required().trim(),
    });

    const schema = Joi.object({
        name: Joi.string().min(2).max(20).required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(6).required(),
        phone: Joi.string()
            .pattern(/^[0-9]{10}$/) // Validate 10-digit phone number
            .required(),
        addresses: Joi.array().items(addressSchema).max(5).required(),
    });

    return schema.validate(data);
};

module.exports = {
    userModel: mongoose.model("User", userSchema),
    validateUser,
};
