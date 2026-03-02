import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    internshipId: {
        type: String,
        required: true,
        refPath: 'internshipModel'
    },
    internshipModel: {
        type: String,
        required: true,
        enum: ['TPOInternship', 'RecruiterInternship', 'StandaloneOffer'],
        default: 'TPOInternship'
    },
    // Fallback fields for standalone/custom offers
    internshipTitle: {
        type: String,
        default: ""
    },
    companyName: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    skillMatchPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    researchInterests: [{
        type: String,
        trim: true
    }],
    resumeUrl: {
        type: String,
        default: ""
    },
    offerLetterUrl: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    aadhar: {
        type: String,
        required: true
    },
    govIdUrl: {
        type: String,
        required: true
    },
    collegeIdUrl: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    accommodation: {
        type: String,
        default: "Not Applicable"
    },
    linkedin: {
        type: String,
        default: ""
    },
    github: {
        type: String,
        default: ""
    },
    portfolio: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "selected", "rejected", "offer_sent", "accepted", "declined"],
        default: "pending"
    },
    rejectionReason: {
        type: String,
        default: ""
    },
    // Code submission fields for recruiter internships
    codeSubmission: {
        type: String,
        default: ""
    },
    codeLanguage: {
        type: String,
        default: ""
    },
    aiAnalysis: {
        qualityScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        timeComplexity: {
            type: String,
            default: ""
        },
        spaceComplexity: {
            type: String,
            default: ""
        },
        codeQualityRating: {
            type: String, // "Excellent", "Good", "Needs Improvement"
            default: ""
        },
        feedback: {
            type: String,
            default: ""
        },
        suggestions: [{
            type: String
        }],
        analyzedAt: {
            type: Date
        }
    },
    proctoringData: {
        tabSwitchCount: {
            type: Number,
            default: 0
        },
        pasteCount: {
            type: Number,
            default: 0
        },
        suspiciousEvents: [{
            type: Object
        }],
        typingSpeedWPM: {
            type: Number,
            default: 0
        },
        isSuspicious: {
            type: Boolean,
            default: false
        },
        verdict: {
            type: String,
            default: "Clean"
        }
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    // Interview Details
    interview: {
        scheduled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String, // "Technical Round", "HR Interview", etc.
            default: ""
        },
        date: {
            type: Date
        },
        link: {
            type: String,
            default: ""
        },
        message: {
            type: String,
            default: ""
        },
        status: {
            type: String, // "scheduled", "completed", "cancelled"
            enum: ["scheduled", "completed", "cancelled", ""],
            default: ""
        }
    },
    // Private notes for recruiters/TPOs
    privateNotes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Index for faster queries
applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });

// Register a dummy model for StandaloneOffer to prevent population crashes
const StandaloneOffer = mongoose.models.StandaloneOffer || mongoose.model("StandaloneOffer", new mongoose.Schema({
    _id: { type: String }
}, { strict: false }));

export default mongoose.model("Application", applicationSchema);
