import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from "../../nats-wrapper";

it('return 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'abasdf',
            price: 20
        })
        .expect(404);
});

it('return 401 if user is not authenticated', async () => {
    const create = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'abasdf',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${create.body.id}`)
        .send({
            title: 'abasdf',
            price: 20
        })
        .expect(401);
});

it('return 401 if user does not own the ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'abasdf',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'abasdf',
            price: 20
        })
        .expect(401);
});

it('return 400 if user provides an invalid title', async () => {
    const user = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', user)
        .send({
            title: 'abasdf',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', user)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
});

it('return 400 if user provides an invalid price', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'abc',
            price: -5
        })
        .expect(400);
});

it('updates the ticket if all is good', async () => {
    const userCookie = global.signin();

    const originalTitle = 'abc';
    const originalPrice = 10;
    const createResponse = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', userCookie)
        .send({
            title: originalTitle,
            price: originalPrice
        });
    
    const modifiedTitle = 'cba';
    const modifiedPrice = 100;
    const modifyResponse = await request(app)
        .put(`/api/tickets/${createResponse.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: modifiedTitle,
            price: modifiedPrice
        });

    expect(modifyResponse.statusCode).toEqual(200);
    expect(modifyResponse.body.title).toEqual(modifiedTitle);
    expect(modifyResponse.body.price).toEqual(modifiedPrice);
});

it('publishes an event', async () => {
    const userCookie = global.signin();

    const originalTitle = 'abc';
    const originalPrice = 10;
    const createResponse = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', userCookie)
        .send({
            title: originalTitle,
            price: originalPrice
        });
    
    const modifiedTitle = 'cba';
    const modifiedPrice = 100;
    await request(app)
        .put(`/api/tickets/${createResponse.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: modifiedTitle,
            price: modifiedPrice
        });

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});