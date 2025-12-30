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
    }
}, {
    timestamps: true
});

export default mongoose.model("Ad", adSchema);
