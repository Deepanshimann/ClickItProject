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
        minlength: 5,
        maxlength: 225,
    },
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,         
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
            minlength: 6,
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
        address: Joi.string().min(5).max(225).required().trim(),
    });

    const schema = Joi.object({
        name: Joi.string().min(2).max(20).trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(6),
        addresses: Joi.array().items(addressSchema).max(5).required(),
    });

    return schema.validate(data);
};

module.exports = {
    userModel: mongoose.model("user", userSchema),
    validateUser,
};
