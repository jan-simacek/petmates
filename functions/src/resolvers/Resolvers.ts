import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Breed, Article } from '../model'
import * as admin from 'firebase-admin'
import { Query, Mutation } from "react-apollo";

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value) {
            return new Date(value); // value from the client
        },
        parseValue(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value) // ast value is always in string format
            }
            return null;
        },
    }),
    Query: {
        async breeds(): Promise<Breed[]> {
            const breeds = await admin
                .firestore()
                .collection('breeds')
                .get()
            return breeds.docs.map(breed => breed.data()) as Breed[]
        },
        async articles(): Promise<Article[]> {
            const articles = await admin
                .firestore()
                .collection('articles')
                .orderBy("createDate", 'desc')
                .get()
            return articles.docs.map(article =>{ return {...article.data(), "_id": article.id} }) as Article[]
        }
    },
    Mutation: {
        async createArticle(rootValue, args): Promise<Article> {
            const articleInput = args.articleInput
            let docData = JSON.parse(JSON.stringify(articleInput))
            docData["createDate"] = Date.now()
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