import { useDrag } from 'react-dnd';
import type { TicketCardProps } from '../types';

const TicketCard = ({ ticket }: TicketCardProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TICKET',
        item: { id: ticket._id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return drag(
        <div className={`p-3 bg-white text-black rounded-md shadow-sm cursor-move ${isDragging ? 'opacity-50' : ''
            }`}
        >
            <h4 className="font-semibold text-sm">{ticket.title}</h4>
            <p className="text-xs text-gray-600">{ticket.description}</p>
        </div>
    );
}

export default TicketCard;