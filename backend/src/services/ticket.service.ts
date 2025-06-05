import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Ticket } from '../model/ticket';
import { Department } from '../model/department';
import { FilterQuery } from 'mongoose';
import { User } from '../model/user';
import { Status } from '../model/status';
import { TicketPayload, ticketQueryPayload, updateTicketPayload } from '../types/payload.type';

// Create Ticket
const createTicket = async (ticketData: TicketPayload) => {
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
        ...(ticketData.departmentId && { department: ticketData.departmentId }),
    });
    await ticket.save();
    return ticket
};

// Get All Tickets
const getAllTickets = async (queryData: ticketQueryPayload) => {
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

// Get Ticket by ID
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

// Update ticket
const updateTicket = async (id: string, data: updateTicketPayload) => {
    if (data.assignedTo) {
        const user = await User.findById(data.assignedTo);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
    }
    if (data.status) {
        const status = await Status.findById(data.status);
        if (!status) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Status not found');
        }
    }
    const ticket = await Ticket.findByIdAndUpdate(id, {
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo
    }, { new: true });
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
    return ticket;
}

export default {
    createTicket,
    getAllTickets,
    getTicket,
    assignTicket,
    updateTicketStatusById,
    updateTicket
};
