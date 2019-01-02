import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Breed, Article, ArticleInput } from '../model'
import * as admin from 'firebase-admin'
import { Query, Mutation } from "react-apollo";
import { BreedsService } from './BreedsService';
import { breedsService } from '../config';

export class ResolverService {
    constructor(private breedService: BreedsService) { }

    public getResolvers(): any {
        const that = this
        return {
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
                    return that.breedService.loadAllBreeds()
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
                    const articleInput = args.articleInput as ArticleInput
                    console.debug(`${articleInput.breedId.constructor}, ${articleInput.breedId}`)
                    const allBreeds = await breedsService.loadAllBreeds()
                    const breed = allBreeds.find(breed => breed.breedId == (+articleInput.breedId))
                    let docData = JSON.parse(JSON.stringify(articleInput))
                    const createDate = Date.now()
                    docData["createDate"] = createDate
                    docData["breedName"] = breed.breedName
                    const docRef = await admin
                        .firestore()
                        .collection('articles')
                        .add(docData)
                    return {
                        _id: docRef.id,
                        createDate: new Date(createDate),
                        breedName: breed.breedName,
                        ...articleInput
                    }
                }
            }
        }
    }
}