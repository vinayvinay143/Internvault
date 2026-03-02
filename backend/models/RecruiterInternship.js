import mongoose from "mongoose";

const recruiterInternshipSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    location: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        enum: ["Remote", "On-site", "Hybrid"],
        default: "On-site",
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: Number,
        min: 0,
        required: true
    },
    requiredSkills: [{
        type: String,
        trim: true
    }],
    requiresCodeSubmission: {
        type: Boolean,
        default: false
    },
    codeSubmissionPrompt: {
        type: String,
        default: ""
    },
    programmingLanguage: {
        type: String,
        enum: ["JavaScript", "Python", "Java", "C++", "C", "Go", "Ruby", "PHP", "TypeScript", "Any"],
        default: "Any"
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "closed", "archived"],
        default: "active"
    },
    applicationsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
recruiterInternshipSchema.index({ recruiterId: 1, status: 1 });
recruiterInternshipSchema.index({ applicationDeadline: 1 });

export default mongoose.model("RecruiterInternship", recruiterInternshipSchema);
