const express = require("express");
const router = express.Router();
const { register, login, getStudents } = require("../controllers/authController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/students", auth, authorizeRoles("admin"), getStudents);

module.exports = router;
