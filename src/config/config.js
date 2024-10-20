import 'dotenv/config';
import fastifySession from '@fastify/session';
import connectMongoDbSession from 'connect-mongodb-session';
import { Admin } from '../models/index.js';

const MongoDBStore = connectMongoDbSession(fastifySession);

export const sessionStore = new MongoDBStore ({
    uri: process.env.MONGO_DB_URI,
    collection: 'sessions'
});

sessionStore.on("error",(error)=>{
    console.log("Session Store Error",error);
});

export const authenticate = async (email,password) => {
    if(email && password) {
        const user = Admin.findOne({email});
        if(user && (await user).password === password){
            return Promise.resolve({email:email, password:password});
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const PORT = process.env.PORT || 3000 ;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;