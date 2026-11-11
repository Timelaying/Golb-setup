const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailEnabled = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    text: `Hi,\n\nClick on the link below to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

// The welcome email is a courtesy: registration must still succeed when email
// is not configured or the mail server is unavailable.
async function sendWelcomeEmail(to, name) {
  if (!emailEnabled()) return null;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Welcome to Our Service!",
    text: `Hi ${name},\n\nThank you for registering on our platform. We are excited to have you on board!\n\nBest regards,\nYour Company`,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Welcome email failed:", err.message);
    return null;
  }
}

module.exports = {
  sendResetEmail,
  sendWelcomeEmail,
  emailEnabled,
};
