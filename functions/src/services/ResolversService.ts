import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Breed, Article, ArticleInput } from '../model'
import { Query, Mutation } from "react-apollo";
import { BreedsService } from './BreedsService';
import { ArticlesService } from './ArticlesService';
import { Region } from '../model/Region';
import { RegionsService } from './RegionsService';
import { StorageService } from './StorageService';
import { UserService } from '.';

export class ResolverService {
    constructor(private breedService: BreedsService, 
        private articlesService: ArticlesService, 
        private regionsService: RegionsService,
        private storageService: StorageService,
        private userService: UserService) { }

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
                    return that.articlesService.loadAllArticles(lastDisplayedId, {sex, breedId, regionId, userId})
                },
                async article(_rootValue, args): Promise<Article> {
                    return that.articlesService.loadArticleById(args.articleId)
                },
                async regions(_rootValue): Promise<Region[]> {
                    return that.regionsService.loadAllRegions()
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
                }
            }
        }
    }
}