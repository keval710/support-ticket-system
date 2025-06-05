import TicketColumn from "./TicketColumn";
import type { Department, Ticket, User } from "../types";

interface UnassignedTicketsProps {
    tickets: Ticket[];
    departments: Department[];
    userList: User[];
    onTicketClick: (id: string) => void;
    onTicketDrop: (ticketId: string, newStatusId: string) => Promise<void>;
    onTicketCreated: () => void;
}

const UnassignedTickets = ({
    tickets,
    departments,
    userList,
    onTicketClick,
    onTicketDrop,
    onTicketCreated
}: UnassignedTicketsProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">Unassigned Tickets</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto p-3 w-full">
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
    );
}

export default UnassignedTickets; 