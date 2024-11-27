const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  collegeJoinedYear: {
    type: Number,
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
});

// Hash password before saving
StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Use a consistent salt round
    console.log("Generated Salt:", salt); // Check if salt is generated
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password:", this.password); // Verify hashed password
    next();
  } catch (error) {
    console.error("Hashing Error:", error);
    next(error);
  }
});

const Student = mongoose.model('Student', StudentSchema, 'students');

module.exports = Student;


/*
[
  { 
    "name": "Ahalya", 
    "rollno": "22CSR008", 
    "department": "CSE", 
    "email": "ahalyar.22cse@kongu.edu", 
    "password": "23-Sep-04", 
    "collegeJoinedYear": "2022", 
    "graduationYear": "2026" 
  },
  { 
    "name": "Ravi", 
    "rollno": "22CSE010", 
    "department": "CSE", 
    "email": "ravik.22cse@kongu.edu", 
    "password": "12-Oct-04", 
    "collegeJoinedYear": "2022", 
    "graduationYear": "2026" 
  },
  { 
    "name": "Priya", 
    "rollno": "22ECE005", 
    "department": "ECE", 
    "email": "priyap.22ece@kongu.edu", 
    "password": "15-Aug-04", 
    "collegeJoinedYear": "2022", 
    "graduationYear": "2026" 
  },
  { 
    "name": "Arun", 
    "rollno": "22ME003", 
    "department": "ME", 
    "email": "aruna.22me@kongu.edu", 
    "password": "10-Dec-04", 
    "collegeJoinedYear": "2022", 
    "graduationYear": "2026" 
  },
  { 
    "name": "Divya", 
    "rollno": "22IT012", 
    "department": "IT", 
    "email": "divyad.22it@kongu.edu", 
    "password": "25-Nov-04", 
    "collegeJoinedYear": "2022", 
    "graduationYear": "2026" 
  }
]
*/