// const Payment = require("./../Payment/Models/paymentModel");
// const config = require("./../Config/Keys");

// class ChapaPayment {
// constructor(enrollment, user, paymentType) {
// this.headers = new Headers();
// this.headers.append("Authorization", `Bearer ${
// config.chapaSecretKey
// }`);
// this.paymentType = paymentType;
// this.enrollment = enrollment;
// this.user = user;
// }

// async pay() {
// const HOSTED_LINK = "link of hosted project";
// // ? tx_ref is now the username and enrollmentId name together.
// const raw = JSON.stringify({
// amount: this.enrollment.package.price,
// currency: "ETB",
// email: this.user.email,
// first_name: this.user.firstName,
// last_name: this.user.lastName,
// phone_number: this.user.phoneNumber,
// tx_ref: this._paymentReference(),
// callback_url: `https://${HOSTED_LINK}/api/v1/payment/webhook/chapa/`,
// return_url: this.enrollment.return_url,
// "customization[title]": "Payment for enrollment.",
// "customization[description]": "As this payment is completed, you will have full access to IconScholar classes you enrolled for."
// });

// this.headers.append("Content-Type", "application/json");

// const requestOptions = {
// method: "POST",
// headers: this.headers,
// body: raw,
// redirect: "follow"
// };

// const response = await fetch("https://api.chapa.co/v1/transaction/initialize", requestOptions);
// // console.log(`IconScholar-${this.enrollment.id}`)
// if (! response.ok) {
// throw new Error(`Payment initialization failed: ${error}`);
// }
// await this._createPayment();
// const responseData = await response.json();
// return responseData;
// }

// async _createPayment() { // here the payment process will be started.
// console.log("here the payment created");
// try {
// let payment = await Payment.findOne({user: this.user, enrollment: this.enrollment});

// if (! payment) { // await Payment.create({user: this.user, enrollment: this.enrollment, paymentReference: this._paymentReference(), paymentType: this.paymentType});
// const newPayment = await Payment.create({
// user: this.user,
// amount: this.enrollment.package.price,
// paymentReference: this._paymentReference(),
// paymentType: this.paymentType,
// enrollment: this.enrollment
// });
// // Assign payment ID to enrollment
// this.enrollment.payment = newPayment._id;
// await this.enrollment.save();
// } else if (payment.status.toLowerCase() === "approved") {
// throw new Error(`You already paid for enrollment`);
// }
// } catch (err) {
// throw new Error(`Error while initiating payment: ${err}`);
// }
// }

// async verify(tx_ref) {
// const requestOptions = {
// method: "GET",
// headers: this.headers,
// redirect: "follow"
// };

// try {
// const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, requestOptions);
// const responseData = await response.json();
// return responseData;
// } catch (error) {
// throw new Error(`Error while verifying payment: ${error}`);
// }
// }

// _paymentReference() {
// return `IconScholar-${
// this.enrollment.id
// }`;
// }
// }

// module.exports = ChapaPayment;
