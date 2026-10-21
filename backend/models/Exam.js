const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subjects: [
    {
      subjectName: String,
      maxMarks: Number,
      passMarks: Number
    }
  ],
  isPublished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Exam", examSchema);
