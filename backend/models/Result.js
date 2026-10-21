const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam"
  },
  marks: [
    {
      subjectName: String,
      marksObtained: Number
    }
  ],
  totalMarks: Number,
  maxTotalMarks: Number,
  percentage: Number,
  grade: String,
  status: String
});

module.exports = mongoose.model("Result", resultSchema);
