import mongoose from "mongoose";

const codeSubmissionSchema = new mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodeChallenge",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    studentName: String,
    studentEmail: String,
    code: {
        type: String,
        required: true
    },
    programmingLanguage: String,
    proctoringData: {
        tabSwitchCount: { type: Number, default: 0 },
        pasteCount: { type: Number, default: 0 },
        maxPasteLength: { type: Number, default: 0 },
        typingSpeedWPM: { type: Number, default: 0 },
        suspiciousEvents: [{
            type: { type: String }, // 'tab_switch', 'paste'
            timestamp: { type: Date },
            details: { type: String }
        }],
        isSuspicious: { type: Boolean, default: false },
        verdict: { type: String, enum: ["Clean", "Suspicious", "Highly Suspicious"], default: "Clean" }
    },
    aiAnalysis: {
        qualityScore: { type: Number, default: 0 },
        timeComplexity: { type: String, default: "" },
        spaceComplexity: { type: String, default: "" },
        codeQualityRating: { type: String, default: "" },
        feedback: { type: String, default: "" },
        suggestions: [{ type: String }],
        analyzedAt: { type: Date }
    },
    status: {
        type: String,
        enum: ["pending", "analyzed", "selected", "rejected", "flagged", "completed"],
        default: "pending"
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const CodeSubmission = mongoose.model("CodeSubmission", codeSubmissionSchema);

export default CodeSubmission;
