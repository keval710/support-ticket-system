import { useState } from "react";
import TicketColumn from "./TicketColumn";
import type { UserBoardProps } from "../types/props.type";

const UserBoard = ({
    user,
    userTickets,
    statuses,
    userList,
    onTicketClick,
    onTicketDrop,
    departments,
    onTicketCreated,
}: UserBoardProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleTicketDrop = async (ticketId: string, newStatusId: string) => {
        setIsUpdating(true);
        try {
            await onTicketDrop(ticketId, newStatusId);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                />
                <h2 className="text-xl font-semibold">{user.name}'s Board</h2>
                {isUpdating && <span className="text-sm text-gray-500">Updating...</span>}
            </div>
            <div className="flex gap-4 overflow-x-auto p-3 w-full scrollbar-hide">
                {statuses.map((status) => (
                    <TicketColumn
                        key={status._id}
                        title={status.title}
                        tickets={userTickets.filter((t) => t.status?._id === status._id)}
                        statusId={status._id}
                        color={status.color}
                        departments={departments}
                        onDropTicket={handleTicketDrop}
                        onTicketClick={onTicketClick}
                        onTicketCreated={() => onTicketCreated(user._id)}
                        userList={userList}
                        assignedTo={user._id}
                        userPicture={user.picture}
                    />
                ))}
            </div>
        </div>
    );
}

export default UserBoard;