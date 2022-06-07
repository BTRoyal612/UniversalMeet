function sendEmail(subject, body, user) {
  var nodemailer = require("nodemailer");

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "meet.universal@gmail.com", // generated ethereal user
      pass: "ddbhooarlbmejpwc", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'meet.universal@gmail.com', // sender address
    to: user, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });
}

// sendEmail("hi", "hello", "hoangnamtrinh15@gmail.com")
exports.sendEmail = sendEmail