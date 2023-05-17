import { OrderCancelledEvent, Publisher, Subjects } from "@angeldimitrov94/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}