const Application = require('../models/applicationModel');
const Student = require('../models/studentModel');
const mongoose = require('mongoose');

const getApplication = async (req, res) => {
    try {
        const applications = await Application.find().populate('studentId', 'name email');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
}

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reasonToReject } = req.body;

    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.status = status;
        if (status === 'rejected') {
            application.reasonToReject = reasonToReject;
            application.rejectionCount = (application.rejectionCount || 0) + 1;
        }
        application.resolvedDate = new Date();
        await application.save();

        res.status(200).json({ message: 'Application updated successfully', application });
    } catch (error) {
        console.error('Error in updateStatus:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
};

const trackApplicationStatus = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate `studentId` is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID' });
        }

        // Fetch all applications for the student
        const applications = await Application.find({ studentId }).sort({ appliedDate: -1 });
        if (!applications.length) return res.status(404).json({ message: 'No applications found for this student.' });

        // Categorize applications by status
        const applicationStatus = {
            pending: applications.filter((app) => app.status === 'pending'),
            approved: applications.filter((app) => app.status === 'approved'),
            rejected: applications.filter((app) => app.status === 'rejected'),
            collect: applications.filter((app) => app.status === 'collect'),
            collected: applications.filter((app) => app.status === 'collected'),
        };

        // Determine eligibility for reapplication
        const lastApplication = applications[0];
        let eligibleToReapply = true;
        if (lastApplication) {
            const currentYear = new Date().getFullYear();
            const lastApplicationYear = new Date(lastApplication.appliedDate).getFullYear();
            if (lastApplication.status === 'approved' && lastApplicationYear === currentYear) {
                eligibleToReapply = false;
            } else if (lastApplication.status === 'rejected' && lastApplication.rejectionCount >= 3) {
                eligibleToReapply = false;
            }
        }

        res.status(200).json({ applicationStatus, eligibleToReapply });
    } catch (error) {
        console.error('Error fetching application status:', error);
        res.status(500).json({ error: 'Failed to fetch application status' });
    }
};

// Function to check application eligibility and apply logic
const applyForBonafied = async (req, res) => {
    const { studentId, reasonToApply } = req.body;
    console.log(" Reached the applyForBonfied route");
    try {
        // Find student record to get current year
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const currentYear = new Date().getFullYear();

        // Check last application status
        const lastApplication = await Application.find({ studentId, status: "rejected" }).sort({ appliedDate: -1 });


            // Check for rejection count
            if (lastApplication.length >= 3) {
                return res.status(400).json({
                    error: 'You have been rejected 3 times. Please approach the HOD office manually.'
                });
            }

        // Allow application if conditions are met
        const newApplication = new Application({
            studentId,
            status: 'pending',
            reasonToApply,
            appliedDate: new Date()
        });

        await newApplication.save();
        res.status(200).json({ message: 'Application submitted successfully' });

    } catch (error) {
        console.error('Error in applyForBonafied:', error);
        res.status(500).json({ error: 'An error occurred while submitting your application.' });
    }
};

// Handle rejection of an application
const rejectApplication = async (req, res) => {
    const { applicationId, reason } = req.body;
    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Increment rejection count
        application.rejectionCount += 1;
        application.status = 'rejected';
        application.resolvedDate = new Date();
        await application.save();

        // Check if rejection count reaches 3
        if (application.rejectionCount >= 3) {
            return res.status(200).json({ message: 'You have been rejected 3 times, please approach the HOD office manually.' });
        }

        res.status(200).json({ message: 'Application rejected successfully', application });
    } catch (error) {
        console.error('Error in rejectApplication:', error);
        res.status(500).json({ error: error.message });
    }
};

// Handle approval of an application
const approveApplication = async (req, res) => {
    const { applicationId } = req.body;
    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.status = 'approved';
        application.resolvedDate = new Date();
        await application.save();

        res.status(200).json({ message: 'Application approved successfully', application });
    } catch (error) {
        console.error('Error in approveApplication:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getApplication,
    updateStatus,
    applyForBonafied,
    rejectApplication,
    approveApplication,
    trackApplicationStatus,
};
