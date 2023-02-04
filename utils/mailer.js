const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "delpha58@ethereal.email",
    pass: "xqpJx6uX2PAfkJqkRz",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = (email, fullname, subject, message) => {
  // const transporter = nodeMailer.createTransport(transporterDetails);
  // transporter.sendMail({
  //   from: "delpha58@ethereal.email",
  //   to: email,
  //   subject: subject,
  //   html: `<h1> سلام ${fullname}</h1>
  //           <p>${message}</p>`,
  // });

  console.log("mailer working");
};
