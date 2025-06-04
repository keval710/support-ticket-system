import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { socketService } from '../services/socket';
import StatusModal from './StatusModal';
import TicketDetailModal from './TicketDetailModal';
import UserBoard from './UserBoard';
import type { Department, Status, Ticket, User } from '../types';
import DepartmentModel from './DepartmentModel';

const StatusBoard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(searchParams.get('userId'));
    const [isLoading, setIsLoading] = useState(false);
    const [userTickets, setUserTickets] = useState<Record<string, Ticket[]>>({});

    // Fetch all users with their tickets
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/user');
            setUsers(res.data);

            // Initialize userTickets map
            const ticketsMap: Record<string, Ticket[]> = {};
            res.data.forEach((user: User) => {
                ticketsMap[user._id] = user.tickets || [];
            });
            setUserTickets(ticketsMap);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch a single user by ID with tickets
    const fetchUserWithTickets = async (userId: string) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/user/${userId}`);
            const userData = res.data;

            // Update userTickets for this user
            setUserTickets(prev => ({
                ...prev,
                [userId]: userData.tickets || [],
            }));

            // Add user to users list if not present
            setUsers(prevUsers => {
                const exists = prevUsers.some(u => u._id === userData._id);
                return exists ? prevUsers : [...prevUsers, userData];
            });
        } catch (error) {
            console.error('Failed to fetch user tickets', error);
        } finally {
            setIsLoading(false);
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

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/api/department');
            setDepartments(res.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    useEffect(() => {
        // Initialize socket connection and event listeners
        socketService.connect();

        socketService.onTicketStatusUpdated(({ ticketId, ticket }) => {
            setUserTickets(prev => {
                const newUserTickets = { ...prev };
                Object.keys(newUserTickets).forEach(userId => {
                    const idx = newUserTickets[userId].findIndex(t => t._id === ticketId);
                    if (idx !== -1) {
                        newUserTickets[userId] = [
                            ...newUserTickets[userId].slice(0, idx),
                            ticket,
                            ...newUserTickets[userId].slice(idx + 1),
                        ];
                    }
                });
                return newUserTickets;
            });
        });

        socketService.onNewTicket((ticket) => {
            if (ticket.assignedTo) {
                setUserTickets(prev => ({
                    ...prev,
                    [ticket.assignedTo as string]: [...(prev[ticket.assignedTo as string] || []), ticket],
                }));
            }
        });

        return () => {
            socketService.offTicketStatusUpdated();
            socketService.offNewTicket();
        };
    }, []);

    useEffect(() => {
        fetchStatuses();
        fetchDepartments();

        if (selectedUserId) {
            fetchUserWithTickets(selectedUserId);
            socketService.joinUserRoom(selectedUserId);
        } else {
            // If no user selected, fetch all users
            fetchUsers();
        }

        return () => {
            if (selectedUserId) {
                socketService.leaveUserRoom(selectedUserId);
            }
        };
    }, [selectedUserId]);

    const handleUserChange = (userId: string) => {
        setSelectedUserId(userId || null);
        if (userId) {
            setSearchParams({ userId });
        } else {
            setSearchParams({});
        }
    };

    const handleStatusCreate = () => setShowStatusModal(true);
    const handleTicketClick = (id: string) => setSelectedTicketId(id);
    const handleDepartmentCreate = () => setShowDepartmentModal(true);

    const handleStatusCreated = () => {
        setShowStatusModal(false);
        fetchStatuses();
    };

    const handleDepartmentCreated = () => {
        setShowDepartmentModal(false);
        fetchDepartments();
    };

    const handleTicketDrop = async (ticketId: string, newStatusId: string) => {
        try {
            socketService.updateTicketStatus(ticketId, newStatusId);
        } catch (err) {
            console.error('Error updating ticket status:', err);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                {/* User Filter */}
                <div className="flex items-center gap-4">
                    <form className="min-w-xs mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-500 rounded-lg bg-gray-100" placeholder="Search..." required />
                        </div>
                    </form>
                    {/* User Avatar Scrollable List */}
                    <div className="flex items-center px-3 py-2 overflow-x-auto max-w-full scrollbar-hide">
                        {/* All Users Option */}
                        <button
                            onClick={() => handleUserChange('')}
                            className={`flex items-center justify-center w-10 h-10 rounded-full border transition bg-white text-xs font-semibold ${!selectedUserId ? 'ring-2 ring-blue-500 border-blue-400 z-[60]' : 'border-gray-300 z-[10]'}`}
                            title="All Users"
                            style={{ zIndex: !selectedUserId ? 30 : 10 }}
                        >
                            All
                        </button>

                        {/* User Avatars */}
                        <div className="flex items-center ml-2">
                            {users.map((user, index) => {
                                const isSelected = selectedUserId === user._id;
                                const zIndex = isSelected ? 70 : 49 - index;
                                const marginLeft = index === 0 ? 0 : -12;

                                return (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserChange(user._id)}
                                        className={`relative mx-1 w-10 h-10 rounded-full border overflow-hidden transition ${isSelected ? 'ring-2 ring-blue-500 border-blue-400' : 'border-gray-300'}`}
                                        title={user.name}
                                        style={{ zIndex, marginLeft }}
                                    >
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {isLoading && (
                            <span className="ml-4 text-sm text-gray-500">Loading...</span>
                        )}
                    </div>
                </div>
                <div className='flex gap-2'>
                    {/* Create Status Button */}
                    <button
                        onClick={handleStatusCreate}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Create Status
                    </button>
                    {/* Create Department Button */}
                    <button
                        onClick={handleDepartmentCreate}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Create Department
                    </button>
                </div>
            </div>
            <div className="space-y-8">
                {selectedUserId ? (
                    users
                        .filter(user => user._id === selectedUserId)
                        .map(user => (
                            <UserBoard
                                key={user._id}
                                user={user}
                                userList={users}
                                userTickets={userTickets[user._id] || []}
                                statuses={statuses}
                                departments={departments}
                                onTicketClick={handleTicketClick}
                                onTicketDrop={handleTicketDrop}
                                onTicketCreated={fetchUserWithTickets}
                            />
                        ))
                ) : (
                    users.map(user => (
                        <UserBoard
                            key={user._id}
                            user={user}
                            userList={users}
                            userTickets={userTickets[user._id] || []}
                            statuses={statuses}
                            departments={departments}
                            onTicketClick={handleTicketClick}
                            onTicketDrop={handleTicketDrop}
                            onTicketCreated={fetchUserWithTickets}
                        />
                    ))
                )}
            </div>

            {showStatusModal &&
                <StatusModal
                    onClose={() => setShowStatusModal(false)}
                    onCreated={handleStatusCreated}
                />}
            {showDepartmentModal &&
                <DepartmentModel
                    onClose={() => setShowDepartmentModal(false)}
                    onCreated={handleDepartmentCreated}
                />}
            {selectedTicketId &&
                <TicketDetailModal
                    ticketId={selectedTicketId}
                    onClose={(updated) => {
                        setSelectedTicketId(null);
                        if (updated && selectedUserId) {
                            fetchUserWithTickets(selectedUserId);
                        }
                    }}
                />}
        </div>
    );
}

export default StatusBoard;