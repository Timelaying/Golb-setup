const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    text: `Hi,\n\nClick on the link below to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendResetEmail,
};
