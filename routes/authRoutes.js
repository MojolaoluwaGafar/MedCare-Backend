const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();

//signup route
router.post("/signup", async (req, res) => {
    console.log("✅ Signup route hit");
    console.log("📥 Request body:", req.body);
  
    try {
      const { fullName, email, password, confirmPassword } = req.body;
  
      if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      console.log("✅ User saved");
  
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("❌ Signup error:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  
  
  
//signin route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });
  
      // Create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      // Respond with user and token
      res.status(200).json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


module.exports = router;
