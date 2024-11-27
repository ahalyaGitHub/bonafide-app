const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StaffSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

StaffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
        
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Staff = mongoose.model('Staff', StaffSchema, 'staff');

module.exports = Staff;
