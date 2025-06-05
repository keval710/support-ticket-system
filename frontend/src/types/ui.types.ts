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
    department?:Department;
    priority: string;
    assignedTo?: User;
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
    department?: Department;
    assignedTo?: User;
    tags: string[];
    dependencies: string[];
    history: [];
    createdAt: string;
    updatedAt: string;
}

export interface TicketCreateModalProps {
    statusId?: string;
    assignedTo?: string;
    userList: User[];
    departments: Department[];
    onClose: (created: boolean) => void;
}

export interface FormValues {
    title: string;
    description: string;
    assignedTo: string;
    priority: '' | 'low' | 'medium' | 'high' | 'urgent';
    departmentId?: string
}

export interface Department {
    _id: string;
    name: string;
}

export interface TicketColumnProps {
    title: string;
    tickets: Ticket[];
    statusId?: string;
    color: string;
    userPicture?: string;
    departments: Department[];
    onDropTicket: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketClick: (ticketId: string) => void;
    onTicketCreated: () => void;
    userList: User[];
}

export interface GoogleUser {
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    hd: string;
    name: string;
    picture: string;
    sub: string; // This is usually the Google user ID
}

export interface AuthContextType {
    user: GoogleUser | null;
    loading: boolean;
    login: (userData: GoogleUser) => void;
    logout: () => void;
}

export interface TicketCreatePayload {
    title: string;
    description: string;
    assignedTo?: string;
    priority: string;
    departmentId?: string;
    status?: string;
}