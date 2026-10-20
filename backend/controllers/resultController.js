const Result = require("../models/Result");
const Exam = require("../models/Exam");

const calculateGrade = (percentage, isPass) => {
  if (!isPass) return "F";
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const saveMarks = async (req, res) => {
  try {
    const { studentId, examId, marks } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let totalMarks = 0;
    let maxTotalMarks = 0;
    let isPass = true;

    for (const sub of exam.subjects) {
      maxTotalMarks += sub.maxMarks;
      const entry = marks.find((m) => m.subjectName === sub.subjectName);

      if (!entry) {
        return res.status(400).json({ message: `Missing marks for ${sub.subjectName}` });
      }

      const score = Number(entry.marksObtained);
      if (isNaN(score) || score < 0) {
        return res.status(400).json({ message: `Marks for ${sub.subjectName} cannot be negative` });
      }

      if (score > sub.maxMarks) {
        return res.status(400).json({ message: `Marks for ${sub.subjectName} cannot exceed ${sub.maxMarks}` });
      }

      if (score < sub.passMarks) {
        isPass = false;
      }

      totalMarks += score;
    }

    const percentage = Number(((totalMarks / maxTotalMarks) * 100).toFixed(2));
    if (percentage < 50) {
      isPass = false;
    }

    const status = isPass ? "Pass" : "Fail";
    const grade = calculateGrade(percentage, isPass);

    let result = await Result.findOne({ student: studentId, exam: examId });

    if (result) {
      result.marks = marks;
      result.totalMarks = totalMarks;
      result.maxTotalMarks = maxTotalMarks;
      result.percentage = percentage;
      result.grade = grade;
      result.status = status;
      await result.save();
    } else {
      result = new Result({
        student: studentId,
        exam: examId,
        marks,
        totalMarks,
        maxTotalMarks,
        percentage,
        grade,
        status
      });
      await result.save();
    }

    res.status(200).json({ message: "Marks saved successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultsByExam = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId }).populate("student", "name rollNumber email semester");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const publishedExams = await Exam.find({ isPublished: true }).select("_id");
    const examIds = publishedExams.map((e) => e._id);

    const results = await Result.find({
      student: req.user.userId,
      exam: { $in: examIds }
    }).populate("exam");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("student", "name rollNumber email semester")
      .populate("exam");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (req.user.role === "student") {
      if (result.student._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!result.exam.isPublished) {
        return res.status(403).json({ message: "Result is not published yet" });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const results = await Result.find().populate("student", "name rollNumber");
    const totalResults = results.length;

    if (totalResults === 0) {
      return res.status(200).json({
        totalResults: 0,
        passPercentage: 0,
        topStudents: [],
        subjectStats: []
      });
    }

    const passedCount = results.filter((r) => r.status === "Pass").length;
    const passPercentage = Number(((passedCount / totalResults) * 100).toFixed(2));

    const sortedResults = [...results].sort((a, b) => b.percentage - a.percentage);
    const topStudents = sortedResults.slice(0, 5).map((r) => ({
      name: r.student ? r.student.name : "N/A",
      rollNumber: r.student ? r.student.rollNumber : "N/A",
      percentage: r.percentage,
      grade: r.grade,
      status: r.status
    }));

    const subjectMap = {};
    results.forEach((r) => {
      r.marks.forEach((m) => {
        if (!subjectMap[m.subjectName]) {
          subjectMap[m.subjectName] = { total: 0, count: 0, highest: 0 };
        }
        subjectMap[m.subjectName].total += m.marksObtained;
        subjectMap[m.subjectName].count += 1;
        if (m.marksObtained > subjectMap[m.subjectName].highest) {
          subjectMap[m.subjectName].highest = m.marksObtained;
        }
      });
    });

    const subjectStats = Object.keys(subjectMap).map((name) => ({
      subjectName: name,
      average: Number((subjectMap[name].total / subjectMap[name].count).toFixed(2)),
      highest: subjectMap[name].highest
    }));

    res.status(200).json({
      totalResults,
      passPercentage,
      topStudents,
      subjectStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveMarks,
  getResultsByExam,
  getMyResults,
  getResultById,
  getDashboardStats
};
