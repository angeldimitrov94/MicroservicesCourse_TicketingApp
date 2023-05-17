import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';

const buildAndSaveTicket = async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 25
    });
    await ticket.save();

    return ticket;
}

it('fetches orders for user', async () => {
    //create 3 tickets
    const ticket1 = await buildAndSaveTicket();
    const ticket2 = await buildAndSaveTicket();
    const ticket3 = await buildAndSaveTicket();
    
    //create 2 orders as user #1
    const user1 = global.signin();
    const user2 = global.signin();

    const { body: order1user1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

    const { body: order2user1 } =await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const { body: order1user2 } =await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    //checks that user #1 returns 2 orders
    const user1Response = await request(app)
        .get('/api/orders')
        .set('Cookie', user1)
        .expect(200);

    const user2Response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    expect(user1Response.body.length).toEqual(2);
    expect(user2Response.body.length).toEqual(1);
    expect(user1Response.body[0].id).toEqual(order1user1.id);
    expect(user1Response.body[1].id).toEqual(order2user1.id);
    expect(user2Response.body[0].id).toEqual(order1user2.id);
})