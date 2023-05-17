import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

declare global {
  function signin(): string[];
}

let mongo: any;
jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  //build a jwt payload {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'email@email.com'
  }
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session object {jwt:MY_JWT}
  const session = { jwt: token };
  //turn session into JSON
  const sessionJSON = JSON.stringify(session);
  //take JSON and encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return string thats the cookie with the encoded data
  return [`session=${base64}`];
};
