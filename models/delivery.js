const mongoose = require("mongoose");
const Joi = require("joi");

const DeliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true,
    },
    deliveryBoy: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "In Transit", "Delivered", "Cancelled"], // Example statuses
        trim: true,
    },
    trackingUrl: {
        type: String,
        
    },

    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0, // Time in hours or minutes, depending on your needs
    },
}, { timestamps: true });

const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(),  // Expecting a valid ObjectId string
        deliveryBoy: Joi.string().min(2).max(50).required().trim(),
        status: Joi.string().valid("Pending", "In Transit", "Delivered", "Cancelled").required(),
        trackingUrl: Joi.string().uri(), // Optional field
        estimatedDeliveryTime: Joi.number().min(0).required(),
    });

    return schema.validate(data);
};

module.exports = {
    deliveryModel: mongoose.model("delivery", DeliverySchema),
    validateDelivery,
};
