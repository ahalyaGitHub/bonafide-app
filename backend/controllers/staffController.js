const Staff = require('../models/staffModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addStaff = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(200).json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to login an admin
const loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const staff = await Staff.findOne({ email });
        if (!staff) return res.status(404).json({message: 'Staff not found' });

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Generate a JWT token
        const token = jwt.sign({ id: staff._id, role: 'staff' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token and role in headers
        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'Staff');

        // Log the token and role in the console
        console.log('JWT Token:', token);
        console.log('Role:', 'Staff');

        // Return the token and role in the response body as well (optional)
        return res.json({ token, role: 'Staff' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addStaff,
    loginStaff,
}