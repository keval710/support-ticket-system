import { useEffect, useState } from 'react';
import type { Status, TicketDetail, TicketDetailModalProps, User } from '../types';
import authApiInterceptor from '../services/axiosInstance/axios.instance';

const TicketDetailModal = ({ ticketId, onClose }: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);
  const [errors, setErrors] = useState({
    status: '',
    priority: '',
    assignee: ''
  });

  const fetchDetails = async () => {
    try {
      const res = await authApiInterceptor.get(`/api/ticket/${ticketId}`);
      setTicket(res.data);
      setSelectedStatus(res.data.status?._id);
      setSelectedPriority(res.data.priority);
      setSelectedAssignee(res.data.assignedTo?._id);
    } catch (err) {
      console.error('Failed to fetch ticket detail', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await authApiInterceptor.get('/api/status');
      setStatuses(res.data);
    } catch (err) {
      console.error('Failed to fetch statuses', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await authApiInterceptor.get('/api/user');
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

  const validateForm = () => {
    const newErrors = {
      status: '',
      priority: '',
      assignee: ''
    };

    if (!selectedStatus) {
      newErrors.status = 'Status is required';
    }
    if (!selectedPriority) {
      newErrors.priority = 'Priority is required';
    }
    if (!selectedAssignee) {
      newErrors.assignee = 'Assignee is required';
    }

    setErrors(newErrors);
    return !newErrors.status && !newErrors.priority && !newErrors.assignee;
  };

  const handleUpdate = async () => {
    if (!ticket) return;
    if (!validateForm()) {
      return;
    }
    setIsUpdating(true);
    try {
      await authApiInterceptor.patch(`/api/ticket/${ticket._id}`, {
        status: selectedStatus,
        priority: selectedPriority,
        assignedTo: selectedAssignee,
      });
      setWasUpdated(true);
      onClose(true);
    } catch (err) {
      console.error('Failed to update ticket', err);
    } finally {
      setIsUpdating(false);
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
              <label className={`block font-medium mb-1 ${errors.status ? 'text-red-600' : 'text-gray-600'}`}>
                Status {!ticket.assignedTo && <span className="text-red-500">*</span>}
              </label>
              <select
                className={`w-full border rounded p-2 ${errors.status
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setErrors(prev => ({ ...prev, status: '' }));
                }}
              >
                <option value="">Select status</option>
                {statuses.map(s => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className={`block font-medium mb-1 ${errors.priority ? 'text-red-600' : 'text-gray-600'}`}>
                Priority {!ticket.assignedTo && <span className="text-red-500">*</span>}
              </label>
              <select
                className={`w-full border rounded p-2 ${errors.priority
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setErrors(prev => ({ ...prev, priority: '' }));
                }}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className={`block font-medium mb-1 ${errors.assignee ? 'text-red-600' : 'text-gray-600'}`}>
                Change Assignee {!ticket.assignedTo && <span className="text-red-500">*</span>}
              </label>
              <select
                className={`w-full border rounded p-2 ${errors.assignee
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                value={selectedAssignee}
                onChange={(e) => {
                  setSelectedAssignee(e.target.value);
                  setErrors(prev => ({ ...prev, assignee: '' }));
                }}
              >
                <option value="">Select assignee</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              {errors.assignee && (
                <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
              )}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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