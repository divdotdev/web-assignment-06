const Exam = require("../models/Exam");
const Result = require("../models/Result");

const createExam = async (req, res) => {
  try {
    const { name, semester, subjects } = req.body;

    if (!name || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Exam name, semester and subjects are required" });
    }

    const exam = new Exam({
      name,
      semester: Number(semester),
      subjects
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExams = async (req, res) => {
  try {
    const filter = {};
    if (req.user && req.user.role === "student") {
      filter.isPublished = true;
      if (req.user.semester) {
        filter.semester = req.user.semester;
      }
    }
    const exams = await Exam.find(filter);
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { name, semester, subjects } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { name, semester: Number(semester), subjects },
      { new: true, runValidators: true }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    await Result.deleteMany({ exam: req.params.id });
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const togglePublish = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    exam.isPublished = !exam.isPublished;
    await exam.save();
    res.status(200).json({ message: `Exam ${exam.isPublished ? "published" : "unpublished"}`, exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  togglePublish
};
