import { useForm } from 'react-hook-form';
import type { FormValues, TicketCreateModalProps, TicketCreatePayload } from '../types';
import { useEffect } from 'react';
import { socketService } from '../services/socket/socket';
import { toast } from 'react-hot-toast';

const TicketCreateModal = ({ statusId, assignedTo, departments, onClose, userList = [] }: TicketCreateModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            description: '',
            priority: '',
            departmentId: '',
            assignedTo: assignedTo || '',
        },
    });

    // Prevent background scroll when modal is open
    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            const ticketPayload: TicketCreatePayload = {
                title: data.title,
                description: data.description,
                priority: data.priority,
            };
            if (data.assignedTo && data.assignedTo !== "") {
                ticketPayload.assignedTo = data.assignedTo;
            }
            if (data.departmentId && data.departmentId !== "") {
                ticketPayload.departmentId = data.departmentId;
            }
            if (statusId) {
                ticketPayload.status = statusId;
            }
            socketService.emitTicketCreated(ticketPayload);
            toast.success('Ticket created successfully');
            onClose(true);
        } catch (error) {
            console.error('Failed to create ticket', error);
            toast.error('Failed to create ticket');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Ticket</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className={`block mb-2 text-md font-medium ${errors.title ? 'text-red-700' : 'text-gray-900'}`}>
                            Title
                        </label>
                        <input
                            className={`w-full text-md rounded-lg block p-2.5 mt-1 focus:outline-none focus:ring-1 ${errors.title
                                ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500'
                                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'
                                }`}
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Enter ticket title"
                        />
                        {errors.title && (
                            <p className="mt-2 text-md text-red-600">
                                <span className="font-medium">{errors.title.message}</span>
                            </p>
                        )}
                    </div>
                    {/* Description */}
                    <div>
                        <label className={`block mb-2 text-md font-medium ${errors.description ? 'text-red-700' : 'text-gray-700'}`}>
                            Description
                        </label>
                        <textarea
                            rows={3}
                            className={`w-full text-md rounded-lg block p-2.5 mt-1 resize-none focus:outline-none focus:ring-1 ${errors.description
                                ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500'
                                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'
                                }`}
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Enter ticket description"
                        />
                        {errors.description && (
                            <p className="mt-2 text-md text-red-600">
                                <span className="font-medium">{errors.description.message}</span>
                            </p>
                        )}
                    </div>
                    {/* Priority */}
                    <div>
                        <label className={`block mb-2 text-md font-medium ${errors.priority ? 'text-red-700' : 'text-gray-700'}`}>
                            Priority
                        </label>
                        <select
                            className={`w-full text-md rounded-lg block p-2.5 mt-1 bg-white focus:outline-none focus:ring-1 ${errors.priority
                                ? 'bg-red-50 border border-red-500 text-red-900 focus:ring-red-500'
                                : 'border border-gray-300 text-gray-900 focus:ring-gray-400'
                                }`}
                            {...register('priority', { required: 'Priority is required' })}
                        >
                            <option value="">Select priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        {errors.priority && (
                            <p className="mt-2 text-md text-red-600">
                                <span className="font-medium"> {errors.priority.message}</span>
                            </p>
                        )}
                    </div>
                    {/* Department */}
                    <div>
                        <label className={`block mb-2 text-md font-medium text-gray-700`}>
                            Department <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <select
                            className="w-full text-md rounded-lg block p-2.5 mt-1 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            {...register('departmentId')}
                        >
                            <option value="">Select department</option>
                            {departments.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Assign To */}
                    <div>
                        <label className={`block mb-2 text-md font-medium text-gray-700`}>
                            Assign to <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <select
                            className="w-full text-md rounded-lg block p-2.5 mt-1 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            {...register('assignedTo')}
                        >
                            <option value="">Select user</option>
                            {userList.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} {user.email ? `(${user.email})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketCreateModal;