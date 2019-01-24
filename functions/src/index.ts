import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// petmates-2b6fe-firebase-adminsdk-opz6l-c4c44fd909.json

import express from 'express'
import cors from 'cors'
import * as config from './config'
import { typeDefs } from './model'

import { ApolloServer } from 'apollo-server-express';

const resolvers = config.resolversService.getResolvers()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    uploads: false
})

const app = express()
app.use(cors())
server.applyMiddleware({app})

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
})

export const api = functions.https.onRequest(app);
