import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Status, TicketDetail, TicketDetailModalProps, User } from '../types';

const TicketDetailModal = ({ ticketId, onClose }: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/api/ticket/${ticketId}`);
      setTicket(res.data);
      setSelectedStatus(res.data.status._id);
      setSelectedPriority(res.data.priority);
      setSelectedAssignee(res.data.assignedTo._id);
    } catch (err) {
      console.error('Failed to fetch ticket detail', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await api.get('/api/status');
      setStatuses(res.data);
    } catch (err) {
      console.error('Failed to fetch statuses', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/user');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchStatuses();
    fetchUsers();
  }, [ticketId]);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleUpdate = async () => {
    if (!ticket) return;
    setIsUpdating(true);
    try {
      await api.patch(`/api/ticket/${ticket._id}`, {
        status: selectedStatus,
        priority: selectedPriority,
        assignedTo: selectedAssignee,
      });
      setWasUpdated(true);
    } catch (err) {
      console.error('Failed to update ticket', err);
    } finally {
      setIsUpdating(false);
      onClose(wasUpdated);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6">
        <h2 className="text-2xl font-bold mb-6">Ticket Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN — Static Info */}
          <div className="space-y-6 text-sm text-gray-800">
            {/* Title */}
            <div>
              <p className="text-gray-500 mb-1">Title</p>
              <p className="text-lg font-semibold">{ticket.title}</p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-500 mb-1">Description</p>
              <p>{ticket.description || '-'}</p>
            </div>

            {/* Department */}
            <div>
              <p className="text-gray-500 mb-1">Department</p>
              <p>{ticket?.department?.name || '-'}</p>
            </div>

            {/* Assigned User */}
            <div>
              <p className="text-gray-500 mb-1">Assigned To</p>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <img
                    src={ticket.assignedTo.picture}
                    alt={ticket.assignedTo.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{ticket.assignedTo.name}</p>
                    <p className="text-gray-500 text-xs">{ticket.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 italic">Unassigned</p>
              )}
            </div>

            {/* Created / Updated */}
            <div className="text-gray-600 space-y-1 text-xs">
              <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* RIGHT COLUMN — Editable Fields */}
          <div className="space-y-5 text-sm">
            {/* Status */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(s => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Priority</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Change Assignee</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
                onClick={() => onClose(wasUpdated)}
              >
                Close
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TicketDetailModal;