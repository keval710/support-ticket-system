import mongoose, { Schema } from 'mongoose';
import { StatusDocument } from '../types';

const StatusSchema = new Schema<StatusDocument>({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    includeInActive: {
        type: Boolean,
        default: true
    },
    autoCloseAfterSeconds: {
        type: Number
    }
}, { timestamps: true });

export const Status = mongoose.model<StatusDocument>('Status', StatusSchema);
