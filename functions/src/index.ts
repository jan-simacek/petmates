import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// petmates-2b6fe-firebase-adminsdk-opz6l-c4c44fd909.json

import * as admin from 'firebase-admin';
import express from 'express'
import cors from 'cors'

const serviceAccount = {
    "type": "service_account",
    "project_id": "petmates-2b6fe",
    "private_key_id": "c4c44fd909ff281eb6669160379c91a1c03c69c7",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCg/8rsPKsoL8D4\n2333lXv9H6hLD133+AdkBtq2N89nXf+PfWTvDuLL/oDbS2/YamCGHf6XoM88gMG/\niERCcYSa0Q4l9rS5kw9Yx3PT2UXHJYo+yikn4j39jT2mu4cvh/F0WBEWigyp4hbC\n2hvp5r4mZZ5uejrHDbm8OUdaQ27nBavw7eERAfSDXl9BpaMimjLoKvBm0XazTLE/\nQM4sJm7/uU6v1iJniA+espta2k8crm5M5S3gVd0X/O19Sgctvm47996M+hA5fMa5\nhykeC/+3xICV9Rz7ywnthvsFVlCVFN0oMuP1okovxRpvTIiYyIAMkjJfb0RyFA21\n/qHaw4nLAgMBAAECggEAP86QqEa1GLSwWJB44IY8gQmqY7Ef71Y7658x0BTXXKKq\n1b3/IiV2qh1gCUlg9tbWEWFS1No1N8fZwaRqVSDzSn4/Crm3T3Limq9Vjujl2DLf\nEtqBLB7krZfsDqf0wFgy0AbVIucsdKm3lprlhDJgOwx8GVHU+K3OZjQXPMVL7z+1\nSnZr5CJbzcKEXtkZ03doYPvCXm1fR+vStBhHY4LpOfsQMWT1nz/fSNPj5AgMtIAL\nZUvj1GxLUsuI9IGPfTsnm+VunwpYlysMgZaOrNvdBDXuYeztvjBOlrUMtUqmmJsF\n4mzm4MhNNeYO/DEjDKD9ITaGX4IeRrNm5s8JXIQVLQKBgQDbStwojwL6BBbyPnH2\ns6j58doky9M57FwIwyZjgqJj/LpIU93IZqeyQ3DTtp7bUTRT64jYT2AdZIG8y50i\niIym64nsn9qZTtvO6qIhZxEvv4cSiUxac+gtobI3vxuSLwrDViMYLNb53lHjEgAi\nViTNNFXgR2HZ+GQri27xJvn/TQKBgQC78vILWoEzAGlp5PQVpw5l/IJFHaJ5YUb7\ngR2AdhLF8gkmfu22LnTbm4SE2g13RMZWO9DLOfpPUJ11LzLnK6f+0uQB4Ph1EsHF\ny+XSKrc9UEp0NMBMvPskurJ719ThixPv/IY5ooLNP5pOniBayj2cSCa4T/ErkKPv\nzh7f36DRdwKBgBQ+auiLmzi9W+js/tRJbZX1T7AJ6Ov19+EPMuII0zjrwb6fj1/K\nqjx4oVfKCgwxCOWeXrmpSjQsbRWirlTbyjA2mjrv3tw8PWpympj+zMVdpvh9GEFZ\nZdugi7U9vSvXj+TMdNzsdsQGVATkSoLg9PDEnhDgRhY7KfQjIRC+CmIZAoGBAIR/\n33d1lIPaFHac/B6PqSzo+QW0wKgFlj8UZTH9C3sVCLJk5Tx8P9HaL3BhMQEWMST2\nAlpjQz3LPVYxshcaxdJ15lwUt9QBJy5Ecn7Zsli9U9/cmH0A9aSNIesA24ktvR6A\nzjevg7sizawC+hhHX2vfybxCT2lBDPGwRD/brco9AoGBANg3LO1HIweZECbqQcjW\nsvl/f8/BZrl2aGUGLT8+3pjkvIkVEoyW5Yp3DOKDm08Cha/C/McfWwpvThww1UCP\n3FkV67Af56BzdHEGwBM/1EMLw68Bc55Qd746m7H46E2xRmQksas2tCQd9MQb18Vo\nyt3U0RfaagcmN9AqV/B8c2mD\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-opz6l@petmates-2b6fe.iam.gserviceaccount.com",
    "client_id": "107874527147529143262",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-opz6l%40petmates-2b6fe.iam.gserviceaccount.com"
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
})

import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server-express';
import {ServiceAccount} from "firebase-admin";

interface Breed {
    _id: string
    breedId: number
    breedName: string
}

interface ArticleInput {
    breedName: string
    breedId: string
    petName: string
    age: number
    isMale: boolean
}

interface Article extends ArticleInput {
    _id: string
}

const typeDefs = gql`
    type Breed {
        breedId: ID!
        breedName: String!
    }
    
    type Query {
        breeds: [Breed]
    }
    
    type Article {
        _id: ID!
        breedName: String
        breedId: ID!
        petName: String!
        age: Int
        isMale: Boolean
    }
    
    input ArticleInput {
        breedName: String
        breedId: ID!
        petName: String!
        age: Int
        isMale: Boolean    
    }
    
    type Mutation {
        createArticle(articleInput: ArticleInput): Article
    }
`

const resolvers = {
    Query: {
        async breeds(): Promise<Breed[]> {
            const breeds = await admin
                .firestore()
                .collection('breeds')
                .get()
            return breeds.docs.map(tweet =>  tweet.data()) as Breed[]
        },
    },
    Mutation: {
        async createArticle(rootValue, args): Promise<Article> {
            const articleInput = args.articleInput
            console.log("before: " + JSON.stringify(articleInput))
            let docData = JSON.parse(JSON.stringify(articleInput))
            console.log("after: " + docData)
            const docRef = await admin
                .firestore()
                .collection('articles')
                .add(docData)
            return {
                _id: docRef.id,
                ...articleInput
            }
        }
    }
}

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
