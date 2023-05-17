import request from "supertest";
import mongoose from "mongoose";
import { app } from '../../app';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@angeldimitrov94/ticketing-common";

it('returns an error if ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if ticket already reserved', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    const order = Order.build({
        ticket, 
        userId: '12hasfh124h',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket successfully', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it.todo('emits an order created event');