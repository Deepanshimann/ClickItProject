const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",  // Reference to the "order" model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    method: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
    },
    transactionID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, { timestamps: true });

const validatePayment = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(),  // Expecting a valid ObjectId string
        amount: Joi.number().min(0).required(),
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionID: Joi.string().required().trim(),
    });

    return schema.validate(data);
};

module.exports = {
    paymentModel: mongoose.model("payment", PaymentSchema),
    validatePayment,
};
