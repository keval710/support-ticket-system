import type { Department, Status, Ticket, User } from "../types";

export interface TicketCardProps {
    ticket: Ticket;
    userPicture?: string;
}

export interface StatusColumnProps {
    status: Status;
    tickets: Ticket[];
    onDropTicket: (ticketId: string, newStatusId: string) => void;
    onTicketClick: (ticketId: string) => void;
    onTicketCreated: () => void;
}

export interface StatusModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export interface DepartmentModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export interface TicketCreateModalProps {
    statusId?: string;
    onClose: (created: boolean) => void;
}

export interface TicketDetailModalProps {
    ticketId: string;
    onClose: (updated?: boolean) => void;
}

export interface UserBoardProps {
    user: User;
    userTickets: Ticket[];
    statuses: Status[];
    userList: User[];
    departments: Department[];
    onTicketClick: (ticketId: string) => void;
    onTicketDrop: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketCreated: (userId: string) => void;
    fetchStatuses: () => void
}

export interface TicketColumnProps {
    title: string;
    tickets: Ticket[];
    statusId?: string;
    color?: string;
    userList: User[];
    departments: Department[];
    onDropTicket?: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketClick: (ticketId: string) => void;
    onTicketCreated: () => void;
}

export interface UnassignedTicketsProps {
    tickets: Ticket[];
    departments: Department[];
    userList: User[];
    onTicketClick: (id: string) => void;
    onTicketDrop: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketCreated: () => void;
}