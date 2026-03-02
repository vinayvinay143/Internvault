import mongoose from "mongoose";

const codeChallengeSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    problemStatement: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    programmingLanguage: {
        type: String,
        default: "Any"
    },
    timeLimit: {
        type: Number, // in minutes
        default: 60
    },
    sampleInput: String,
    sampleOutput: String,
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "closed"],
        default: "active"
    },
    submissionsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const CodeChallenge = mongoose.model("CodeChallenge", codeChallengeSchema);

export default CodeChallenge;
