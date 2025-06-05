import mongoose, { Schema } from "mongoose";
import { IUser, Provider, Role } from "../types";

const userSchema = new Schema<IUser>({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String
    },
    picture: {
        type: String,
    },
    provider: {
        type: String,
        enum: Provider,
        default: Provider.GOOGLE
    },
    providerId: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: Role,
        default: Role.USER
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);
