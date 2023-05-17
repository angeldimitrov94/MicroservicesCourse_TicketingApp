import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@angeldimitrov94/ticketing-common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

const ORDER_EXPIRATION_SECONDS = 15 * 60;
router.post('/api/orders', requireAuth, 
[ 
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
],
validateRequest,
async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //Find the ticket user is trying to order in db
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }
    
    //Make sure ticket is not already ordered
    const isReserved = await ticket.isReserved();

    if(isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }

    //Calculate expiration date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + ORDER_EXPIRATION_SECONDS);

    //Build order and save to db
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    //Publish even to notify of order created

    res.status(201).send(order);
})

export { router as newOrderRouter };