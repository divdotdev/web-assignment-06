const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  passMarks: {
    type: Number,
    required: true,
    default: 40
  }
});

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subjects: [subjectSchema],
  isPublished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Exam", examSchema);
