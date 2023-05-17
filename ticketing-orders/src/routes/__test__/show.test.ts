import request from "supertest";
import mongoose from "mongoose";
import { app } from '../../app';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@angeldimitrov94/ticketing-common";

it('fetches an order', async () => {
    //create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    //make request to build order wiht this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
})

it('returns an error if user A fetches user Bs order', async () => {
    //create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    //make request to build order wiht this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
})