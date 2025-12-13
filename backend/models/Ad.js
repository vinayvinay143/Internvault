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
        type: String, // URL to apply
        required: true
    },
    imageUrl: {
        type: String, // URL of company logo/poster
        default: ""
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index: MongoDB automatically deletes docs after this time
    }
}, {
    timestamps: true
});

export default mongoose.model("Ad", adSchema);
