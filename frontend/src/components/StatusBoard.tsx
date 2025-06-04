import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { socketService } from '../services/socket';
import StatusModal from './StatusModal';
import TicketDetailModal from './TicketDetailModal';
import UserBoard from './UserBoard';
import type { Status, Ticket, User } from '../types';

const StatusBoard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(searchParams.get('userId'));
    const [isLoading, setIsLoading] = useState(false);
    const [userTickets, setUserTickets] = useState<Record<string, Ticket[]>>({});

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/user');
            setUsers(res.data);
            // Initialize user tickets
            const ticketsMap: Record<string, Ticket[]> = {};
            res.data.forEach((user: User) => {
                ticketsMap[user._id] = user.tickets || [];
            });
            setUserTickets(ticketsMap);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const res = await api.get('/api/status');
            setStatuses(res.data);
        } catch (error) {
            console.error('Failed to fetch statuses', error);
        }
    };

    const fetchUserWithTickets = async (userId: string) => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/user');
            const userData = res.data.find((user: User) => user._id === userId);
            if (userData) {
                setUserTickets(prev => ({
                    ...prev,
                    [userId]: userData.tickets || []
                }));
            }
        } catch (error) {
            console.error('Failed to fetch user tickets', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initialize socket connection
        socketService.connect();
        // Set up socket event listeners
        socketService.onTicketStatusUpdated(({ ticketId, ticket }) => {
            // Update the ticket in the userTickets state
            setUserTickets(prev => {
                const newUserTickets = { ...prev };
                Object.keys(newUserTickets).forEach(userId => {
                    // Find the ticket in the current user's tickets
                    const ticketIndex = newUserTickets[userId].findIndex(t => t._id === ticketId);
                    if (ticketIndex !== -1) {
                        // Replace the old ticket with the new one
                        newUserTickets[userId] = [
                            ...newUserTickets[userId].slice(0, ticketIndex),
                            ticket,
                            ...newUserTickets[userId].slice(ticketIndex + 1)
                        ];
                    }
                });
                return newUserTickets;
            });
        });
        socketService.onNewTicket((ticket) => {
            // Add the new ticket to the appropriate user's tickets
            if (ticket.assignedTo) {
                setUserTickets(prev => ({
                    ...prev,
                    [ticket.assignedTo as string]: [...(prev[ticket.assignedTo as string] || []), ticket]
                }));
            }
        });
        // Clean up socket listeners
        return () => {
            socketService.offTicketStatusUpdated();
            socketService.offNewTicket();
        };
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchStatuses();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            fetchUserWithTickets(selectedUserId);
            // Join the user's room
            socketService.joinUserRoom(selectedUserId);
        }
        return () => {
            if (selectedUserId) {
                socketService.leaveUserRoom(selectedUserId);
            }
        };
    }, [selectedUserId]);

    const handleUserChange = (userId: string) => {
        setSelectedUserId(userId);
        if (userId) {
            setSearchParams({ userId });
        } else {
            setSearchParams({});
        }
    };

    const handleCreate = () => setShowModal(true);
    const handleStatusCreated = () => {
        setShowModal(false);
        fetchStatuses();
    };

    const handleTicketDrop = async (ticketId: string, newStatusId: string) => {
        try {
            // Emit socket event for status update
            socketService.updateTicketStatus(ticketId, newStatusId);
        } catch (err) {
            console.error('Error updating ticket status:', err);
        }
    };

    const handleTicketClick = (id: string) => setSelectedTicketId(id);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Ticket Status</h2>
                    <select
                        className="border rounded-lg px-3 py-2"
                        value={selectedUserId || ''}
                        onChange={(e) => handleUserChange(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">All Users</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {isLoading && <span className="text-gray-500">Loading...</span>}
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Create Status
                </button>
            </div>
            <div className="space-y-8">
                {selectedUserId ? (
                    // Show selected user's board
                    users
                        .filter(user => user._id === selectedUserId)
                        .map(user => (
                            <UserBoard
                                key={user._id}
                                user={user}
                                userTickets={userTickets[user._id] || []}
                                statuses={statuses}
                                onTicketClick={handleTicketClick}
                                onTicketDrop={handleTicketDrop}
                                onTicketCreated={fetchUserWithTickets}
                            />
                        ))
                ) : (
                    // Show all users' boards
                    users.map(user => (
                        <UserBoard
                            key={user._id}
                            user={user}
                            userTickets={userTickets[user._id] || []}
                            statuses={statuses}
                            onTicketClick={handleTicketClick}
                            onTicketDrop={handleTicketDrop}
                            onTicketCreated={fetchUserWithTickets}
                        />
                    ))
                )}
            </div>
            {showModal &&
                <StatusModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleStatusCreated}
                />}
            {selectedTicketId &&
                <TicketDetailModal
                    ticketId={selectedTicketId}
                    onClose={(updated) => {
                        setSelectedTicketId(null)
                        if (updated && selectedUserId) {
                            fetchUserWithTickets(selectedUserId);
                        }
                    }}
                />}
        </div>
    );
}

export default StatusBoard;