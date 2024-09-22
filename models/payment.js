const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestamps: true });

const validatePayment = (data) => {
    const schema = Joi.object({
        orderId: Joi.string().required(),          // Matches Mongoose 'orderId'
        paymentId: Joi.string().optional(),        // Matches Mongoose 'paymentId' 
        signature: Joi.string().optional(),        // Matches Mongoose 'signature' 
        amount: Joi.number().min(0).required(),    // Matches Mongoose 'amount'
        currency: Joi.string().required(),         // Matches Mongoose 'currency'
        status: Joi.string().valid('pending', 'completed', 'failed').default('pending'), // Matches Mongoose 'status'
    });

    return schema.validate(data);
};

module.exports = {
    paymentModel: mongoose.model("payment", PaymentSchema),
    validatePayment,
};
