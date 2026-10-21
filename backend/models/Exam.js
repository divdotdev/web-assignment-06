const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: String,
  semester: Number,
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
