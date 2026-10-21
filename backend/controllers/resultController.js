const Result = require("../models/Result");
const Exam = require("../models/Exam");

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

    for (let i = 0; i < exam.subjects.length; i++) {
      const sub = exam.subjects[i];
      maxTotalMarks += sub.maxMarks;

      const entry = marks.find((m) => m.subjectName === sub.subjectName);
      const score = entry ? Number(entry.marksObtained) : 0;

      if (score < 0 || score > sub.maxMarks) {
        return res.status(400).json({ message: `Invalid marks for ${sub.subjectName}` });
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

    let grade = "F";
    if (isPass) {
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
    }

    const status = isPass ? "Pass" : "Fail";

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

    res.json({ message: "Marks saved successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultsByExam = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId }).populate("student", "name rollNumber");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const publishedExams = await Exam.find({ isPublished: true });
    const examIds = publishedExams.map((e) => e._id);

    const results = await Result.find({
      student: req.user.userId,
      exam: { $in: examIds }
    }).populate("exam");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    let result = await Result.findById(req.params.id)
      .populate("student", "name rollNumber email semester")
      .populate("exam");

    if (!result) {
      result = await Result.findOne({ exam: req.params.id, student: req.user.userId })
        .populate("student", "name rollNumber email semester")
        .populate("exam");
    }

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const results = await Result.find().populate("student", "name rollNumber");
    const totalResults = results.length;

    if (totalResults === 0) {
      return res.json({
        totalResults: 0,
        passPercentage: 0,
        topStudents: [],
        subjectStats: []
      });
    }

    const passedCount = results.filter((r) => r.status === "Pass").length;
    const passPercentage = Number(((passedCount / totalResults) * 100).toFixed(2));

    const sorted = [...results].sort((a, b) => b.percentage - a.percentage);
    let rank = 1;
    const topStudents = sorted.slice(0, 5).map((r, i) => {
      if (i > 0 && r.percentage < sorted[i - 1].percentage) {
        rank = i + 1;
      }
      return {
        rank: rank,
        name: r.student ? r.student.name : "N/A",
        rollNumber: r.student ? r.student.rollNumber : "N/A",
        percentage: r.percentage,
        grade: r.grade,
        status: r.status
      };
    });

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

    res.json({
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
