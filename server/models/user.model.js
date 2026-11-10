
import { Schema, model } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "recruiter", "candidate"],
        default: "candidate"
    },

    avatar: {
        type: String,
        default: ""
    },

    isBlocked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = model("User", userSchema);

export default User;
