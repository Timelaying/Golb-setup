// controllers/register.controller.js
const bcrypt = require("bcrypt");
const { createUser, findUserByUsername } = require("../models/users.model");
const pool = require("../db");
const { sendWelcomeEmail } = require("../utils/email.util");
const errorCodes = require("../utils/errorCodes");

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    return res.status(200).json({ message: "You are already registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, username, email, password: hashedPassword });

  await sendWelcomeEmail(newUser.email, newUser.name);

  res.status(201).json({
    message: "User registered successfully. A welcome email has been sent.",
    user: newUser,
  });
};
