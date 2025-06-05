import type { UnassignedTicketsProps } from "../types/props.type";
import TicketColumn from "./TicketColumn";

const UnassignedTickets = ({
    tickets,
    departments,
    userList,
    onTicketClick,
    onTicketDrop,
    onTicketCreated
}: UnassignedTicketsProps) => {
    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                <h2 className="text-xl font-semibold">Unassigned Tickets</h2>
            </div>

            {/* Ticket Column Scroll Area */}
            <div className="flex-1 overflow-x-auto px-3 pb-3 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    <TicketColumn
                        title="Unassigned"
                        tickets={tickets}
                        onTicketClick={onTicketClick}
                        onTicketCreated={onTicketCreated}
                        color="#818181"
                        departments={departments}
                        onDropTicket={onTicketDrop}
                        userList={userList}
                    />
                </div>
            </div>
        </div>
    );
}

export default UnassignedTickets; 