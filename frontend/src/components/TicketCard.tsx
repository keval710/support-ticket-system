import { useDrag } from 'react-dnd';
import { getPriorityColor } from '../utils/helper';
import dayjs from 'dayjs';
import type { TicketCardProps } from '../types/props.type';

const TicketCard = ({ ticket, userPicture }: TicketCardProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TICKET',
        item: { id: ticket._id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const priorityColor = getPriorityColor(ticket.priority);

    return drag(
        <div
            className={`group p-4 rounded-xl shadow-sm bg-white hover:shadow-md border border-gray-200 transition
              ${isDragging ? 'opacity-40 scale-[0.98]' : ''}
            `}
        >
            {/* Header Row: Title + Priority */}
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-base text-gray-900 leading-tight">
                    {ticket.title}
                </h4>
                {ticket.priority && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor}`}>
                        {ticket.priority}
                    </span>
                )}
            </div>

            {/* Ticket ID and Department */}
            <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-2">
                <span className="font-mono">#{ticket._id.slice(-5)}</span>
                {ticket.department?.name && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {ticket.department.name}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">{ticket.description}</p>

            {/* Footer Row: Avatar + Status + Created Date */}
            <div className="flex justify-between items-center text-xs text-gray-600">
                {/* Assignee */}
                {userPicture && (
                    <img
                        src={userPicture}
                        className="w-7 h-7 rounded-full object-cover border"
                        referrerPolicy="no-referrer"
                        title="Assignee"
                    />
                )}

                {/* Status */}
                {ticket.status?.title && (
                    <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                        {ticket.status.title}
                    </span>
                )}

                {/* Created At */}
                {ticket.createdAt && (
                    <span className="ml-auto text-[10px] text-gray-400">
                        {dayjs(ticket.createdAt).format('DD MMM, YYYY')}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
