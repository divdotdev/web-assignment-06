const express = require("express");
const router = express.Router();
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  togglePublish
} = require("../controllers/examController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/", auth, authorizeRoles("admin"), createExam);
router.get("/", auth, getExams);
router.get("/:id", auth, getExamById);
router.put("/:id", auth, authorizeRoles("admin"), updateExam);
router.delete("/:id", auth, authorizeRoles("admin"), deleteExam);
router.patch("/:id/publish", auth, authorizeRoles("admin"), togglePublish);

module.exports = router;
