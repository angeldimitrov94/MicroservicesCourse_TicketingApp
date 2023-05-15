import { Publisher, Subjects, TicketUpdatedEvent } from "@angeldimitrov94/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}