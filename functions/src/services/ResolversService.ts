import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Breed, Article, ArticleInput, conversationFields, Conversation, Message } from '../model'
import { Query, Mutation } from "react-apollo";
import { Region } from '../model/Region';
import { BreedsService, ArticlesService, RegionsService, StorageService, ConversationService, UserService } from '.';
import { messagesService } from '../config';
import { MessagesService } from './MessagesService';

export class ResolverService {
    constructor(private breedService: BreedsService, 
        private articlesService: ArticlesService, 
        private regionsService: RegionsService,
        private storageService: StorageService,
        private userService: UserService,
        private conversationService: ConversationService,
        private messagesService: MessagesService) { }

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
                async articles(_rootValue, args): Promise<Article[]> {
                    const lastDisplayedId = args.lastDisplayedId as string
                    const sex = args.sex as string
                    const breedId = args.breedId as number
                    const regionId = args.regionId as number
                    const userId = args.userId as string
                    let likedByUser = undefined
                    if(args.likedByToken) {
                        likedByUser = (await that.userService.resolveUser(args.likedByToken as string)).uid
                    }

                    return that.articlesService.loadAllArticles(lastDisplayedId, {sex, breedId, regionId, userId, likedByUser})
                },
                async article(_rootValue, args): Promise<Article> {
                    return that.articlesService.loadArticleById(args.articleId)
                },
                async regions(_rootValue): Promise<Region[]> {
                    return that.regionsService.loadAllRegions()
                },
                async conversations(_rootValue, args): Promise<Conversation[]> {
                    const lastDisplayedId = args.lastDisplayedId as string
                    const userToken = args.userToken as string

                    return that.conversationService.loadConversations(userToken, lastDisplayedId)
                },
                async messages(_rootValue, args): Promise<Message[]> {
                    const conversationId = args.conversationId as string
                    const userToken = args.userToken as string
                    const lastDisplayedId = args.lastDisplayedId as string

                    return await that.messagesService.loadMessages(conversationId, userToken, lastDisplayedId)
                }
            },
            Mutation: {
                async createArticle(_rootValue, args): Promise<Article> {
                    const articleInput = args.articleInput as ArticleInput
                    return that.articlesService.createArticle(articleInput)
                },
                async deleteArticle(_rootValue, args): Promise<Article> {
                    const articleId = args.articleId as string
                    const userToken = args.userToken as string
                    
                    const result = await that.articlesService.deleteArticle(articleId, userToken)
                    
                    const userId = (await that.userService.resolveUser(userToken)).uid
                    try {
                        await that.storageService.deleteImage(result.imageId, userId)
                    } catch(err) {
                        console.log(`error deleting image: ${err}`)
                    }
                    
                    return result
                },
                async renewArticle(_rootValue, args): Promise<Article> {
                    const articleId = args.articleId as string
                    const userToken = args.userToken as string

                    return await that.articlesService.renewArticle(articleId, userToken)
                },
                async addOrRemoveLike(_rootValue, args): Promise<Article> {
                    const articleId = args.articleId as string
                    const userToken = args.userToken as string
                    const isAdd = args.isAdd as boolean

                    return await that.articlesService.addOrRemoveLike(articleId, userToken, isAdd)
                },
                async deleteConversation(_rootValue, args): Promise<Conversation> {
                    const conversationId = args.conversationId as string
                    const userToken = args.userToken as string

                    return await that.conversationService.deleteConversation(conversationId, userToken)
                }
             }
        }
    }
}