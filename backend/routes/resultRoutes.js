const express = require("express");
const router = express.Router();
const {
  saveMarks,
  getResultsByExam,
  getMyResults,
  getResultById,
  getDashboardStats
} = require("../controllers/resultController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/marks", auth, authorizeRoles("admin"), saveMarks);
router.get("/exam/:examId", auth, authorizeRoles("admin"), getResultsByExam);
router.get("/my-results", auth, getMyResults);
router.get("/dashboard", auth, authorizeRoles("admin"), getDashboardStats);
router.get("/:id", auth, getResultById);

module.exports = router;
