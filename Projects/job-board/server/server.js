import {ApolloServer} from "apollo-server-express";
import cors from 'cors';
import express from 'express';
import {expressjwt} from 'express-jwt';
import {readFile} from 'fs';``
import jwt from 'jsonwebtoken';
import {User} from './db.js';
import {resolvers} from "./resolvers.js";

const PORT = 9000;
const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), express.json(), expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret: JWT_SECRET,
}));

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne((user) => user.email === email);
    if (user && user.password === password) {
        const token = jwt.sign({sub: user.id}, JWT_SECRET);
        res.json({token});
    } else {
        res.sendStatus(401);
    }
});

const typeDefs = await readFile('./schema.graphql', 'utf8', function(error) {
  console.log('read error!');
});
console.log(typeDefs)
const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
// graphql이 express 서버의 미들웨어로 동작하게 해준다. 이를 통해 /graphql uri로 오는것들만 처리
apolloServer.applyMiddleware({app, path: '/graphql'});


app.listen({port: PORT}, () => {
    console.log(`Server running on port ${PORT}`);
});
