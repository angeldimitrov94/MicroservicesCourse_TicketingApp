import { OrderCreatedEvent, Publisher, Subjects } from "@angeldimitrov94/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}