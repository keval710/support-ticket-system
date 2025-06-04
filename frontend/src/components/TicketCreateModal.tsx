// src/components/TicketCreateModal.tsx
import { useState } from 'react';
import api from '../services/api';
import { socketService } from '../services/socket';
import type { TicketCreateModalProps } from '../types';

const TicketCreateModal = ({ statusId, onClose, assignedTo }: TicketCreateModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!title || !description) return;

        setIsCreating(true);
        try {
            const response = await api.post('/api/ticket', {
                title,
                description,
                priority,
                assignedTo,
                ...(statusId && { status: statusId }),
            });

            // Emit the new ticket event through socket
            socketService.emitTicketCreated(response.data);

            onClose(true);
        } catch (error) {
            console.error('Failed to create ticket', error);
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Title</label>
                        <input
                            className="w-full border rounded p-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter ticket title"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter ticket description"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Priority</label>
                        <select
                            className="w-full border rounded p-2"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                        onClick={() => onClose(false)}
                        disabled={isCreating}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleCreate}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketCreateModal;