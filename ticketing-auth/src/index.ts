import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose, { mongo } from 'mongoose';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        const mongoDbConnectionString = 'mongodb://ticketing-auth-mongo-srv:27017/auth';
        await mongoose.connect(mongoDbConnectionString);
        console.log(`Connected to mongodb with connection string : ${mongoDbConnectionString}`);
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () =>{
        console.log('Listening on port 3000');
    })
};

start();