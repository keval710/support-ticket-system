import { useDrop } from "react-dnd";
import { useState, useRef } from "react";
import TicketCard from "./TicketCard";
import TicketCreateModal from "./TicketCreateModal";
import type { TicketColumnProps } from "../types";

const TicketColumn = ({
    title,
    tickets,
    statusId,
    color,
    userList,
    onDropTicket,
    onTicketClick,
    departments,
    onTicketCreated,
}: TicketColumnProps) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isDropping, setIsDropping] = useState(false);
    const columnRef = useRef<HTMLDivElement>(null);

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

    // Apply the drop ref
    drop(columnRef);

    return (
        <div
            ref={columnRef}
            className={`relative rounded-2xl shadow-xl min-h-[580px] min-w-[300px] max-w-[300px] flex-shrink-0 transition-all duration-300 border border-gray-200 overflow-hidden 
                ${isDropping ? "drop-shadow-lg scale-[0.98]" : ""} 
                ${isOver ? "ring-4 ring-blue-500 opacity-80" : ""}`}
            style={{ 
                backgroundColor: color,
            }}
        >
            {/* Overlay effect for all drop targets except hovered */}
            {isDropping && !isOver && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in z-20 pointer-events-none" />
            )}
            <div className="relative z-30 p-4 h-full flex flex-col text-white">
                {/* Header with bottom border */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/30">
                    <h3 className="font-semibold text-lg tracking-wide">{title}</h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-sm text-gray-800 font-medium px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        + Add
                    </button>
                </div>

                {/* Ticket List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mt-3 custom-scrollbar">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} onClick={() => onTicketClick(ticket._id)} className="cursor-pointer">
                            <TicketCard ticket={ticket} />
                        </div>
                    ))}
                </div>
            </div>
            {showCreateModal && (
                <TicketCreateModal
                    statusId={statusId}
                    userList={userList}
                    departments={departments}
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