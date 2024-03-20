// const nodeMailer = require("nodemailer");
// const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });

// const sendEmail = async (to, subject, text, html) => {
//   const mailOptions = {
//     from: process.env.SMPT_MAIL,
//     to,
//     subject,
//     text,
//     html,
//   };
//   try{
//       await transporter.sendMail(mailOptions);
//       console.log("Daily mail sent to: " + to);
//   }catch(e){
//     console.log("Error in sending daily mail: " + e.message);
//   }
// };
// const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });

// const sendEmail = async (to, subject, text, html) => {
//   const mailOptions = {
//     from: process.env.SMPT_MAIL,
//     to,
//     subject,
//     text,
//     html,
//   };
//   try{
//       await transporter.sendMail(mailOptions);
//       console.log("Daily mail sent to: " + to);
//   }catch(e){
//     console.log("Error in sending daily mail: " + e.message);
//   }
// };

// module.exports = sendEmail;

// module.exports = sendEmail;

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
  console.log("Mail sent to: " + options.email, options.subject);
};

module.exports = sendEmail;