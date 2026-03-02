import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    whatsappNotifications: {
        type: Boolean,
        default: true
    },
    organization: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        enum: ["BTech", "MTech", ""],
        default: ""
    },
    role: {
        type: String,
        enum: ["student", "tpo", "recruiter"],
        default: "student"
    },
    companyName: {
        type: String,
        default: ""
    },
    companyWebsite: {
        type: String,
        default: ""
    },
    industry: {
        type: String,
        default: ""
    },
    companySize: {
        type: String,
        default: ""
    },
    // New Student Profile Fields
    resume: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    github: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});



userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
