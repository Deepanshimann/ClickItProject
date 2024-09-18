// require('dotenv').config();
// const Razorpay = require('razorpay');
// const{ paymentModel }= require('../models/payment');
// const express=require("express");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });




const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount in the smallest unit (cents)
            currency: 'gbp',
            payment_method_types: ['card'],
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;











// router.post('/create/orderId', async (req, res) => {
//     const options = {
//       amount: 100 * 100, // amount in smallest currency unit
//       currency: "GBP",
//     };
//     try {
//       const order = await razorpay.orders.create(options);
//       res.send(order);
  
//       const newPayment = await paymentModel.create({
//         orderId: order.id,
//         amount: order.amount,
//         currency: order.currency,
//         status: 'pending',
//       });
  
//     } catch (error) {
//       res.status(500).send('Error creating order');
//     }
//   });

  
// router.post('/api/payment/verify', async (req, res) => {
//     const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
//     const secret = process.env.RAZORPAY_KEY_SECRET
  
//     try {
//       const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')
  
//       const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
//       if (result) {
//         const payment = await paymentModel.findOne({ orderId: razorpayOrderId,status:"pending" });
//         payment.paymentId = razorpayPaymentId;
//         payment.signature = signature;
//         payment.status = 'completed';
//         await payment.save();
//         res.json({ status: 'success' });
//       } else {
//         res.status(400).send('Invalid signature');
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('Error verifying payment');
//     }
//   });
//   module.exports=router;
  