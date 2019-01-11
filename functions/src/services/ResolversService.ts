import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Breed, Article, ArticleInput } from '../model'
import { Query, Mutation } from "react-apollo";
import { BreedsService } from './BreedsService';
import { ArticlesService } from './ArticlesService';

export class ResolverService {
    constructor(private breedService: BreedsService, private articlesService: ArticlesService) { }

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
                    return that.articlesService.loadAllArticles(lastDisplayedId, {sex})
                },
                async article(_rootValue, args): Promise<Article> {
                    return that.articlesService.loadArticleById(args.articleId)
                }
            },
            Mutation: {
                async createArticle(_rootValue, args): Promise<Article> {
                    const articleInput = args.articleInput as ArticleInput
                    return that.articlesService.createArticle(articleInput)
                }
            }
        }
    }
}