import mongoose, { Schema } from 'mongoose';
import { EscalationRuleDocument, LogicOperator, Priority } from '../types';

const EscalationRuleSchema = new Schema<EscalationRuleDocument>({
    name: {
        type: String,
        required: true
    },
    conditions: {
        department: {
            type: mongoose.Types.ObjectId,
            ref: 'Department'
        },
        statusId: {
            type: mongoose.Types.ObjectId,
            ref: 'Status'
        },
        priority: {
            type: String,
            enum: Priority
        },
        elapsedMinutes: {
            type: Number
        },
    },
    actions: {
        newDepartment: {
            type: mongoose.Types.ObjectId,
            ref: 'Department'
        },
        newStatus: {
            type: mongoose.Types.ObjectId,
            ref: 'Status'
        },
        newPriority: {
            type: String,
            enum: Priority
        },
        escalateToUser: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        replyMessage: {
            type: String
        },
    },
    logicOperator: {
        type: String,
        enum: LogicOperator,
        default: LogicOperator.AND,
    },
}, { timestamps: true });

export const EscalationRule = mongoose.model<EscalationRuleDocument>('EscalationRule', EscalationRuleSchema);
