export interface DepartmentPayload {
    name: string;
    description?: string;
    email?: string;
    assignedAdmins?: string[];
    hidden?: boolean;
}

export interface StatusPayload {
    title: string;
    color: string;
}

export interface TicketPayload {
    title: string;
    description: string;
    priority: string;
    departmentId?: string;
    assignedTo?: string;
    tags?: string[];
    status?: string;
}

export interface updateTicketPayload {
    priority: string;
    assignedTo: string;
    status: string;
}

export interface ticketQueryPayload {
    departmentId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}

