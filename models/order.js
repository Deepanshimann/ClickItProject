const mongoose = require("mongoose");
const Joi = require("joi");

const OrderSchema = mongoose.Schema({
    orderId:{
type:String,
required:true,
    },
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
        min: 1,
    },
    address: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"], // Example statuses
        trim: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        required: true,
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "delivery",
        required: true,
    },
}, { timestamps: true });

const validateOrder = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(),  // Expecting a valid ObjectId string
        products: Joi.array().items(Joi.string().required()).required(),  // Array of ObjectId strings
        totalPrice: Joi.number().min(1).required(),
        address: Joi.string().min(5).max(255).required().trim(),
        status: Joi.string().valid("Pending", "Shipped", "Delivered", "Cancelled").required(),
        payment: Joi.string().required(),  // Expecting a valid ObjectId string
        delivery: Joi.string().required(),  // Expecting a valid ObjectId string
    });

    return schema.validate(data);
};

module.exports = {
    orderModel: mongoose.model("order", OrderSchema),
    validateOrder,
};
