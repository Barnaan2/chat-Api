// const Payment = require('./../Payment/Models/paymentModel');
// var crypto = require('crypto');
// const secret = require("./../Config/Keys").chapaSecretKey;

// exports.chapaWebhook = async (req, res) => {
// console.log(" HERE ----- IS THE --- RESPONSE");
// const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');

// // console.log(hash);
// // console.log(req.headers['chapa-signature'])
// // console.log(req.headers['x-chapa-signature']);

// if (hash == req.headers['x-chapa-signature']) {
// // Retrieve the request's body
// // I should set the enrolled course fields as completed and add reff aproved.ref should be stored.
// // ! I will find it by the payment reference sent from chapa
// console.log(req.body)
// console.log(req.body.tx_ref)

// const paymentReference = req.body.tx_ref;
// const payment = await Payment.findOne({paymentReference: paymentReference});

// // console.log(payment);
// // ! The response of webhook should be an endpoint to redirected to.
// if (payment) {
// payment.status = "Approved";
// payment.approvedByChapa = true;
// await payment.save();
// }

// // console.log(event);
// // Do something with event
// res.sendStatus(200);
// } else {
// res.status(404).json({status: "Not found", message: "Sorry :("})
// }
// }
