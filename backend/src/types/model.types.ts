import mongoose, { Document } from 'mongoose';
import { LogicOperator, Priority, Provider, Role } from './enums';

export interface IUser extends Document {
    name: string;
    email: string;
    picture: string;
    googleId?: string;
    provider?: Provider;
    providerId?: string;
    role?: Role;
    isEmailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface StatusDocument extends Document {
    title: string;
    color: string;
    includeInActive: boolean;
    isActive: boolean;
    autoCloseAfterSeconds?: number;
}

export interface DepartmentDocument extends Document {
    name: string;
    description?: string;
    emails?: string[];
    assignedAdmins?: mongoose.Types.ObjectId[];
    hidden?: boolean;
}

export interface TicketDocument extends Document {
    title: string;
    description: string;
    priority: Priority;
    department: mongoose.Types.ObjectId;
    status: mongoose.Types.ObjectId;
    tags?: string[];
    assignedTo?: mongoose.Types.ObjectId;
    dependencies?: mongoose.Types.ObjectId[];
    history?: {
        message: string;
        timestamp: Date;
        user: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface Condition {
    department?: string;
    status?: string;
    priority?: Priority;
    elapsedMinutes?: number;
}

interface Action {
    newDepartment?: string;
    newStatus?: string;
    newPriority?: Priority;
    escalateToUser?: string;
    replyMessage?: string;
}

export interface EscalationRuleDocument extends Document {
    name: string;
    conditions: Condition;
    actions: Action;
    logicOperator: LogicOperator;
}