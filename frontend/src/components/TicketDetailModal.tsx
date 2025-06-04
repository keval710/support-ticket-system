import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Status, TicketDetail, TicketDetailModalProps } from '../types';

const TicketDetailModal = ({ ticketId, onClose }: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/api/ticket/${ticketId}`);
        setTicket(res.data);
        setSelectedStatus(res.data.status);
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

    fetchDetails();
    fetchStatuses();
  }, [ticketId]);

  const handleStatusChange = async () => {
    if (!ticket || !selectedStatus || selectedStatus === ticket.status) return;
    setIsUpdating(true);
    try {
      await api.patch(`/api/ticket/${ticket._id}`, { statusId: selectedStatus });
      setTicket({ ...ticket, status: selectedStatus });
      setWasUpdated(true);
    } catch (err) {
      console.error('Failed to update ticket status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Ticket Details</h3>
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>

        <div className="mt-4">
          <label className="block font-medium mb-1">Update Status</label>
          <select
            className="w-full border rounded p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s._id} value={s._id}>{s.title}</option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </div>

        <button
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          onClick={() => onClose(wasUpdated)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TicketDetailModal;