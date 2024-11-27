const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const StudentRoute = require('./routes/studentRoute');
const StaffRoute = require('./routes/staffRoute');
const ApplicationRoute = require('./routes/applicationRoute');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

app.use('/students',StudentRoute);
app.use('/staff',StaffRoute);
app.use('/applications',ApplicationRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
