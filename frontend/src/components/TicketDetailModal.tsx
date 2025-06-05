import { useEffect, useState } from 'react';
import type { Status, TicketDetail, User } from '../types';
import authApiInterceptor from '../services/axiosInstance/auth.instance';
import type { TicketDetailModalProps } from '../types/props.type';
import toast from 'react-hot-toast';

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
      setSelectedStatus(res.data.status?._id || '');
      setSelectedPriority(res.data.priority || '');
      setSelectedAssignee(res.data.assignedTo?._id || '');
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

    if (!selectedStatus) newErrors.status = 'Status is required';
    if (!selectedPriority) newErrors.priority = 'Priority is required';
    if (!selectedAssignee) newErrors.assignee = 'Assignee is required';

    setErrors(newErrors);
    return !newErrors.status && !newErrors.priority && !newErrors.assignee;
  };

  const handleUpdate = async () => {
    if (!ticket) return;
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      await authApiInterceptor.patch(`/api/ticket/${ticket._id}`, {
        status: selectedStatus,
        priority: selectedPriority,
        assignedTo: selectedAssignee,
      });
      setWasUpdated(true);
      onClose(true);
      toast.success('Ticket updated successfully');
    } catch (err) {
      console.error('Failed to update ticket', err);
      toast.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-8 text-gray-900">Ticket Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT COLUMN - Static Info */}
          <div className="space-y-8 text-gray-800">
            {/* Title */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Title</p>
              <h3 className="text-xl font-semibold text-gray-900">{ticket.title}</h3>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="whitespace-pre-wrap text-gray-700">{ticket.description || '-'}</p>
            </div>

            {/* Department */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full select-none">
                {ticket.department?.name || '-'}
              </div>
            </div>

            {/* Assigned User */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Assigned To</p>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-4">
                  <img
                    src={ticket.assignedTo.picture}
                    alt={ticket.assignedTo.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{ticket.assignedTo.name}</p>
                    <p className="text-sm text-gray-500">{ticket.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500">Unassigned</p>
              )}
            </div>

            {/* Created / Updated */}
            <div className="text-gray-500 space-y-1 text-xs">
              <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Editable Fields */}
          <div className="space-y-7 text-gray-800">
            {/* Status */}
            <div>
              <label className={`block font-semibold mb-2 ${errors.status ? 'text-red-600' : 'text-gray-700'}`}>
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg p-3 text-gray-800
                  ${errors.status ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setErrors(prev => ({ ...prev, status: '' }));
                }}
              >
                <option value="" disabled>Select status</option>
                {statuses.map(s => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className={`block font-semibold mb-2 ${errors.priority ? 'text-red-600' : 'text-gray-700'}`}>
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg p-3 text-gray-800
                  ${errors.priority ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setErrors(prev => ({ ...prev, priority: '' }));
                }}
              >
                <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            </div>

            {/* Assignee */}
            <div>
              <label className={`block font-semibold mb-2 ${errors.assignee ? 'text-red-600' : 'text-gray-700'}`}>
                Change Assignee <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg p-3 text-gray-800
                  ${errors.assignee ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                value={selectedAssignee}
                onChange={(e) => {
                  setSelectedAssignee(e.target.value);
                  setErrors(prev => ({ ...prev, assignee: '' }));
                }}
              >
                <option value="" disabled>Select assignee</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              {errors.assignee && <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                onClick={() => onClose(wasUpdated)}
              >
                Close
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
