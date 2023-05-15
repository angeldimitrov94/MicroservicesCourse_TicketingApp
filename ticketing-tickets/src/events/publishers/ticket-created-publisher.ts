import { Publisher, Subjects, TicketCreatedEvent } from "@angeldimitrov94/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}