const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, semester, subjects } = req.body;
    const exam = new Exam({ name, semester, subjects });
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, semester, subjects } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    exam.name = name;
    exam.semester = semester;
    exam.subjects = subjects;
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    await Result.deleteMany({ exam: req.params.id });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/publish", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    exam.isPublished = !exam.isPublished;
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
