import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { ticketService } from '../services';

// Create Ticket
const createTicket = catchAsync(async (req, res) => {
    const ticket = await ticketService.createTicket(req.body);
    res.status(httpStatus.CREATED).json(ticket);
});

// Get All Tickets
const getAllTickets = catchAsync(async (req, res) => {
    const tickets = await ticketService.getAllTickets(req.query);
    res.status(httpStatus.OK).json(tickets);
});

const getTicket = catchAsync(async (req, res) => {
    const ticket = await ticketService.getTicket(req.params.id);
    res.status(httpStatus.OK).json(ticket)
})

// Assign Ticket
const assignTicket = catchAsync(async (req, res) => {
    const ticket = await ticketService.assignTicket(req.params.id, req.body.assignedTo);
    res.status(httpStatus.OK).json(ticket);
});

export default {
    createTicket,
    getAllTickets,
    getTicket,
    assignTicket
};
