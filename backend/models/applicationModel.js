const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student',  
        required: true 
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'collect','collected'], required: true },
    rejectionCount: { type: Number, default: 0 },
    appliedDate: { type: Date, default: Date.now },
    approvedDate: { type: Date },
    rejectedDate: { type: Date },
    collectDate: { type: Date },
    collectedDate: { type: Date },
    reasonToApply: {type: String},
    reasonToReject: { type:String },
}, { timestamps: true });

const Application = mongoose.model( 'Application', ApplicationSchema, 'applications');
module.exports= Application;
