import mongoose, { Schema } from "mongoose";
import { Priority, TicketDocument } from "../types";

const ticketSchema = new Schema<TicketDocument>({
    title: String,
    description: String,
    priority: {
        type: String,
        enum: Priority
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
    },
    tags: [{
        type: String
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    history: [{
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
        metadata: Object
    }],
}, { timestamps: true });

export const Ticket = mongoose.model<TicketDocument>('Ticket', ticketSchema);
