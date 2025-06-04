export interface User {
    _id: string;
    name: string;
    email: string;
    picture: string;
    provider: string;
    providerId: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    tickets: Ticket[];
}

export interface Status {
    _id: string;
    title: string;
    color: string;
    isActive: boolean;
    includeInActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Ticket {
    _id: string;
    title: string;
    description: string;
    status: Status;
    priority: string;
    assignedTo?: string;
    tags: string[];
    dependencies: string[];
    history: [];
    createdAt: string;
    updatedAt: string;
}

export interface TicketDetail {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: Status;
    assignedTo?: string;
    tags: string[];
    dependencies: string[];
    history: [];
    createdAt: string;
    updatedAt: string;
}

export interface TicketCreateModalProps {
    statusId?: string;
    assignedTo?: string;
    onClose: (created: boolean) => void;
}
