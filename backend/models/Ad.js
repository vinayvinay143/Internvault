import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    companyName: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Flagged', 'Unverified'],
        default: 'Unverified'
    },
    verificationReason: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model("Ad", adSchema);
