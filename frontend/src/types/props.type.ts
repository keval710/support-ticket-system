import type { Status, Ticket } from "../types";

export interface TicketCardProps {
    ticket: Ticket;
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

export interface TicketCreateModalProps {
    statusId?: string;
    onClose: (created: boolean) => void;
}

export interface TicketDetailModalProps {
    ticketId: string;
    onClose: (updated?: boolean) => void;
}