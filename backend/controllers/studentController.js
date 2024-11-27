const Student = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Add user data (Sign up)
const addStudent = async (req, res) => {
    const { name, rollNo, department, email, password, collegeJoinedYear, graduationYear } = req.body;

    try {
        // Check if email already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const student = new Student({ name, rollNo, department, email, password, collegeJoinedYear, graduationYear }); 
        await student.save(); 
        res.status(200).json({ message: 'Student registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login functionality
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Attempting login with email: ${email}`);

        const student = await Student.findOne({ email });
        if (!student) {
            console.log('Student not found');
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log('Student found:', student);

        const isMatch = await bcrypt.compare(password, student.password);
        console.log(`Password match status: ${isMatch}`);

        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: student._id, role: 'Student' },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' }
        );

        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'Student');

        console.log('JWT Token:', token);
        console.log('Role:', 'Student');

        return res.status(200).json({ token, role: 'Student' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get student profile
const getProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student detail not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Error fetching student data' });
    }
};

// Update profile functionality
const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { year } = req.body;
    const profileImage = req.file ? req.file.path : null;  // Get the image path from multer

    try {
        // Find the student by ID and update their profile
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student data
        student.year = year || student.year;  // If year isn't provided, retain current year
        if (profileImage) {
            student.profileImage = profileImage;  // If profile image is provided, update it
        }

        // Save the updated student record
        await student.save();

        // Respond with the updated student data
        res.status(200).json(student);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = {
    addStudent,
    loginStudent,
    getProfile,
    updateProfile,
};
