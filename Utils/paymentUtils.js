// const ChapaPayment = require('./../payment/chapa');

// //! In the production mode do create payment methods list
// //! because it would be changed frequently.
// //! also now that it should be one of setting
// //! options that would be changed by admin user.
// exports.paymentInitiator = async (course,user,method) =>{
//     let response;
//     if(method == 'chapa'){
//         const chapaPayment = new ChapaPayment(course,user);
//         response = await chapaPayment.pay();
//     }
//     else if( method == 'tele Birr'){
//       // tele birr handle should be added here.


//     }
//     else if(method == 'mobile Banking'){
//         // mobile banking handler should be added here.

//     }

//     else{
//         throw new Error('The provdied payment method is not valid !')
//     }
//     return response;
// }
