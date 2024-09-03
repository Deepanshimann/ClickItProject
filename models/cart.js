const mongoose = require("mongoose");
const Joi = require("joi");

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
}, { timestamps: true });

const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(),  // Expecting a valid ObjectId string
        products: Joi.array().items(Joi.string().required()).required(),  // Array of ObjectId strings
        totalPrice: Joi.number().min(0).required(),
    });

    return schema.validate(data);
};

module.exports = {
    cartModel: mongoose.model("cart", CartSchema),
    validateCart,
};
