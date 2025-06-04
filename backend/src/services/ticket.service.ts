import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Ticket } from '../model/ticket';
import { Department } from '../model/department';
import { FilterQuery } from 'mongoose';
import { User } from '../model/user';
import { Request, Response } from 'express';
import { Server } from 'socket.io';

// Create Ticket
const createTicket = async (ticketData: any) => {
    if (ticketData.departmentId) {
        const departmentExists = await Department.findOne({ _id: ticketData.departmentId });
        if (!departmentExists) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Department does not exist');
        }
    }
    if (ticketData.assignedTo) {
        const userExists = await User.findOne({ _id: ticketData.assignedTo });
        if (!userExists) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
        }
    }
    const ticket = new Ticket({
        ...ticketData,
        department: ticketData.departmentId
    });
    await ticket.save();
    return {
        message: 'Ticket created successfully',
        ticket: {
            id: ticket._id,
            name: ticket.title
        }
    };
};

// Get All Tickets
const getAllTickets = async (queryData: any) => {
    const {
        departmentId,
        status,
        priority,
        assignedTo,
        tags,
        page = 1,
        limit = 10
    } = queryData;
    const filter: FilterQuery<typeof Ticket> = {};
    if (departmentId) filter.department = departmentId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (tags && tags.length) filter.tags = { $all: tags };
    const skip = (page - 1) * limit;
    const [tickets, totalResults] = await Promise.all([
        Ticket.find(filter)
            .populate('department status assignedTo')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Ticket.countDocuments(filter)
    ]);
    const totalPages = Math.ceil(totalResults / limit);
    return {
        results: tickets,
        totalResults,
        totalPages,
        page,
        limit
    };
};

const getTicket = async (id: string) => {
    const ticket = await Ticket.findById(id).populate('department status assignedTo');
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket does not exist');
    }
    return ticket;
};

// Assign Ticket
const assignTicket = async (ticketId: string, assignedTo: string) => {
    const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { assignedTo },
        { new: true }
    );
    if (!ticket) throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    return {
        message: `Ticket assigned to ${assignedTo}`
    };
};

// Update ticket status by ID (for socket events)
const updateTicketStatusById = async (ticketId: string, statusId: string) => {
    const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { status: statusId },
        { new: true }
    ).populate('assignedTo').populate('status');
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
    return ticket;
};

export default {
    createTicket,
    getAllTickets,
    getTicket,
    assignTicket,
    updateTicketStatusById
};
