import mongoose, { Schema } from 'mongoose';
import { DepartmentDocument } from '../types';

const DepartmentSchema = new Schema<DepartmentDocument>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    email: {
        type: String
    },
    assignedAdmins: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Department = mongoose.model<DepartmentDocument>('Department', DepartmentSchema);
