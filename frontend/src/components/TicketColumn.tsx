import { useDrop } from "react-dnd";
import { useState } from "react";
import TicketCard from "./TicketCard";
import TicketCreateModal from "./TicketCreateModal";
import type { Ticket } from "../types";

interface TicketColumnProps {
    title: string;
    tickets: Ticket[];
    statusId?: string;
    color?: string;
    userId: string;
    onDropTicket?: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketClick: (ticketId: string) => void;
    onTicketCreated: () => void;
}

const TicketColumn = ({
    title,
    tickets,
    statusId,
    color = "#6b7280",
    userId,
    onDropTicket,
    onTicketClick,
    onTicketCreated,
}: TicketColumnProps) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isDropping, setIsDropping] = useState(false);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "TICKET",
        drop: async (item: { id: string }) => {
            if (onDropTicket && statusId) {
                setIsDropping(true);
                try {
                    await onDropTicket(item.id, statusId);
                } finally {
                    setIsDropping(false);
                }
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return drop(
        <div
            className={`p-4 rounded-lg shadow-md min-h-[580px] min-w-[300px] max-w-[300px] flex-shrink-0 transition-all duration-300 relative ${isOver ? "bg-opacity-80" : ""} ${isDropping ? "opacity-50" : ""}`}
            style={{ backgroundColor: color }}
        >
            <div className={statusId ? "text-white" : ""}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-bold text-lg ${!statusId ? "text-gray-700" : ""}`}>{title}</h3>
                    <button
                        className={`${statusId ? "bg-white text-black" : "bg-white text-black"} px-2 py-1 rounded text-sm`}
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Add
                    </button>
                </div>
                <div className="mt-2 space-y-2 overflow-y-auto max-h-[70vh] pr-2">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} onClick={() => onTicketClick(ticket._id)}>
                            <TicketCard ticket={ticket} />
                        </div>
                    ))}
                </div>
            </div>
            {showCreateModal && (
                <TicketCreateModal
                    statusId={statusId}
                    assignedTo={userId}
                    onClose={(created) => {
                        setShowCreateModal(false);
                        if (created) {
                            onTicketCreated();
                        }
                    }}
                />
            )}
        </div>
    );
}

export default TicketColumn; 