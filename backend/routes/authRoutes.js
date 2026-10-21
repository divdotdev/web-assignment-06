const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, semester } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      rollNumber: rollNumber || "",
      semester: semester || 1
    });

    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        semester: user.semester
      },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        semester: user.semester
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/students", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    let query = { role: "student" };
    if (req.query.semester) {
      query.semester = Number(req.query.semester);
    }
    const students = await User.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
