import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';
import { OrderStatus } from '@angeldimitrov94/ticketing-common';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
    //create a ticket with ticket model
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    //make request to make an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to cancel an order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    //expectation to make sure order is cancelled
    const { body: cancelledOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled event', async () => {
    //create a ticket with ticket model
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    //make request to make an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to cancel an order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    //expectation to make sure order is cancelled
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});