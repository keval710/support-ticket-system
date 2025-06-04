import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ticketService } from '../services';
import config from '../config/config';

export const initializeSocket = (httpServer: HttpServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: config.front_end_url,
            methods: ['GET', 'POST'],
            credentials: true,
            allowedHeaders: ['*']
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 10000
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('joinUserRoom', (userId: string) => {
            socket.join(`user:${userId}`);
        });

        socket.on('leaveUserRoom', (userId: string) => {
            socket.leave(`user:${userId}`);
        });

        socket.on('updateTicketStatus', async ({ ticketId, newStatusId }) => {
            try {
                const ticket = await ticketService.updateTicketStatusById(ticketId, newStatusId);
                if (ticket && ticket.assignedTo) {
                    // Emit to all clients in the user's room
                    io.to(`user:${ticket.assignedTo._id}`).emit('ticketStatusUpdated', {
                        ticketId,
                        ticket
                    });
                    // Also emit to all connected clients for real-time updates
                    io.emit('ticketStatusUpdated', {
                        ticketId,
                        ticket
                    });
                }
            } catch (error) {
                console.error('Error updating ticket status:', error);
                socket.emit('error', { message: 'Failed to update ticket status' });
            }
        });

        socket.on('ticketCreated', async (ticket) => {
            try {
                // Get the complete ticket data using the service
                const completeTicket = await ticketService.getTicket(ticket._id);
                if (completeTicket && completeTicket.assignedTo) {
                    // Emit to all clients in the user's room
                    io.to(`user:${completeTicket.assignedTo._id}`).emit('newTicket', completeTicket);
                }
                // Also emit to all connected clients
                io.emit('newTicket', completeTicket);
            } catch (error) {
                console.error('Error emitting new ticket:', error);
                socket.emit('error', { message: 'Failed to emit new ticket' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });
    return io;
};