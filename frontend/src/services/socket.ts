import { io, Socket } from 'socket.io-client';
import type { Ticket } from '../types';

class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;
    private retryCount = 0;
    private maxRetries = 5;
    private retryDelay = 3000; // 3 seconds

    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect() {
        if (!this.socket) {
            this.socket = io(import.meta.env.VITE_BASE_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket server');
                this.retryCount = 0;
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                this.handleConnectionError();
            });

            this.socket.on('disconnect', (reason) => {
                console.log('Disconnected from socket server:', reason);
                if (reason === 'io server disconnect') {
                    // Server initiated disconnect, try to reconnect
                    this.socket?.connect();
                }
            });
        }
        return this.socket;
    }

    private handleConnectionError() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Retrying connection (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => {
                this.socket?.connect();
            }, this.retryDelay);
        } else {
            console.error('Max retry attempts reached. Please check your connection.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinUserRoom(userId: string) {
        this.socket?.emit('joinUserRoom', userId);
    }

    leaveUserRoom(userId: string) {
        this.socket?.emit('leaveUserRoom', userId);
    }

    updateTicketStatus(ticketId: string, newStatusId: string) {
        this.socket?.emit('updateTicketStatus', { ticketId, newStatusId });
    }

    emitTicketCreated(ticket: Ticket) {
        this.socket?.emit('ticketCreated', ticket);
    }

    onTicketStatusUpdated(callback: (data: { ticketId: string, ticket: Ticket }) => void) {
        this.socket?.on('ticketStatusUpdated', callback);
    }

    onNewTicket(callback: (ticket: Ticket) => void) {
        this.socket?.on('newTicket', callback);
    }

    offTicketStatusUpdated() {
        this.socket?.off('ticketStatusUpdated');
    }

    offNewTicket() {
        this.socket?.off('newTicket');
    }
}

export const socketService = SocketService.getInstance(); 