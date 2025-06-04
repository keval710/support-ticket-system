import { Ticket } from "../model/ticket";
import { User } from "../model/user";
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const getUsers = async () => {
    const users = await User.find();
    if (!users) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }
    const tickets = await Ticket.find({ assignedTo: { $in: users.map(user => user._id) } }).populate('department status');
    const ticketsByUserId = tickets.reduce((acc: any, ticket: any) => {
        const userId = ticket.assignedTo.toString();
        if (!acc[userId]) acc[userId] = [];
        acc[userId].push(ticket);
        return acc;
    }, {});
    // Attach tickets to their respective users
    const usersWithTickets = users.map(user => {
        return {
            ...user.toObject(),
            tickets: ticketsByUserId[user._id.toString()] || []
        };
    });
    return usersWithTickets;
};


const getUserById = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }
    const tickets = await Ticket.find({ assignedTo: user?._id }).populate('department status');
    return {
        ...user?.toObject(),
        tickets
    };
}

export default {
    getUsers,
    getUserById
}