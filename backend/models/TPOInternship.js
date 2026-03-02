import mongoose from "mongoose";

const tpoInternshipSchema = new mongoose.Schema({
    tpoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 300
    },
    duration: {
        type: String,
        enum: ["1 week", "2 weeks", "1 month"],
        required: true
    },
    locationType: {
        type: String,
        enum: ["Remote", "On-site", "Hybrid"],
        default: "On-site",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    stipend: {
        type: Number,
        min: 0,
        max: 50000,
        required: true
    },
    seats: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    },
    requiredSkills: [{
        type: String,
        trim: true
    }],
    programType: {
        type: String,
        enum: ["BTech", "MTech"],
        default: "BTech"
    },
    researchTopics: [{
        type: String,
        trim: true
    }],
    eligibility: {
        yearOfStudy: [{
            type: String,
            enum: ["1", "2", "3", "4", "Other"]
        }],
        minCGPA: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        }
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    isTPOHosted: {
        type: Boolean,
        default: true
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

// Auto-delete internships after application deadline
tpoInternshipSchema.index({ applicationDeadline: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TPOInternship", tpoInternshipSchema);
