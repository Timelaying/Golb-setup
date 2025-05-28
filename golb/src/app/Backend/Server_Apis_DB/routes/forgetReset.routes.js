// routes/forgetReset.routes.js
const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  forgotPassword,
  resetPassword
} = require("../controllers/password.controller");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
