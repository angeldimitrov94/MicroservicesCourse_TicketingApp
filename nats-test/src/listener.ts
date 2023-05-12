import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log(`Listener connected to NATS! Client ID [${clientId}]`);

    stan.on('close', () => {
        console.log(`NATS connection closed! Client ID [${clientId}]`);
        process.exit();
    })

    new TicketCreatedListener(stan).listen();
});

stan.on('ticket:created', () => {
    console.log('ticket:created event received!');
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());