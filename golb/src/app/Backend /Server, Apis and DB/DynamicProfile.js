require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.get("/api/profile/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    res.json(user);
  });
  
  module.exports = router;
