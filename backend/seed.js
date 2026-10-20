const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Exam = require("./models/Exam");
const Result = require("./models/Result");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/exam_system");

    await User.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});

    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Exam Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      rollNumber: "ADM-01",
      semester: 3
    });

    const studentsData = [
      { name: "Rahul Sharma", email: "rahul@example.com", rollNumber: "2026-CSE-001" },
      { name: "Priya Patel", email: "priya@example.com", rollNumber: "2026-CSE-002" },
      { name: "Aman Verma", email: "aman@example.com", rollNumber: "2026-CSE-003" },
      { name: "Sneha Reddy", email: "sneha@example.com", rollNumber: "2026-CSE-004" },
      { name: "Rohan Gupta", email: "rohan@example.com", rollNumber: "2026-CSE-005" },
      { name: "Ananya Iyer", email: "ananya@example.com", rollNumber: "2026-CSE-006" },
      { name: "Vikram Singh", email: "vikram@example.com", rollNumber: "2026-CSE-007" },
      { name: "Pooja Nair", email: "pooja@example.com", rollNumber: "2026-CSE-008" },
      { name: "Karan Mehta", email: "karan@example.com", rollNumber: "2026-CSE-009" },
      { name: "Neha Joshi", email: "neha@example.com", rollNumber: "2026-CSE-010" }
    ];

    const students = [];
    for (const s of studentsData) {
      const user = await User.create({
        name: s.name,
        email: s.email,
        password: studentPassword,
        role: "student",
        rollNumber: s.rollNumber,
        semester: 3
      });
      students.push(user);
    }

    const exam1 = await Exam.create({
      name: "Mid-Sem Exam 2026",
      semester: 3,
      isPublished: true,
      subjects: [
        { subjectName: "Data Structures", maxMarks: 100, passMarks: 40 },
        { subjectName: "Web Development", maxMarks: 100, passMarks: 40 },
        { subjectName: "Database Systems", maxMarks: 100, passMarks: 40 }
      ]
    });

    const exam2 = await Exam.create({
      name: "End-Sem Exam 2026",
      semester: 3,
      isPublished: false,
      subjects: [
        { subjectName: "Data Structures", maxMarks: 100, passMarks: 40 },
        { subjectName: "Web Development", maxMarks: 100, passMarks: 40 },
        { subjectName: "Database Systems", maxMarks: 100, passMarks: 40 }
      ]
    });

    const sampleMarks = [
      [92, 95, 90],
      [85, 88, 84],
      [78, 80, 75],
      [90, 85, 92],
      [65, 70, 68],
      [58, 62, 55],
      [42, 45, 48],
      [32, 50, 45],
      [74, 76, 72],
      [88, 91, 87]
    ];

    for (let i = 0; i < students.length; i++) {
      const m = sampleMarks[i];
      const marks = [
        { subjectName: "Data Structures", marksObtained: m[0] },
        { subjectName: "Web Development", marksObtained: m[1] },
        { subjectName: "Database Systems", marksObtained: m[2] }
      ];

      const totalMarks = m[0] + m[1] + m[2];
      const maxTotalMarks = 300;
      const percentage = Number(((totalMarks / maxTotalMarks) * 100).toFixed(2));

      let isPass = true;
      if (m[0] < 40 || m[1] < 40 || m[2] < 40 || percentage < 50) {
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

      await Result.create({
        student: students[i]._id,
        exam: exam1._id,
        marks,
        totalMarks,
        maxTotalMarks,
        percentage,
        grade,
        status
      });
    }

    console.log("Database seeded successfully with 1 admin, 10 students, 2 exams, and 10 results!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
