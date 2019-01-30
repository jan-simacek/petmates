import { ApolloClient } from 'apollo-client'
import {Article, ArticleInput} from "../model";
import gql from "graphql-tag";
import {NormalizedCacheObject, InMemoryCache} from 'apollo-cache-inmemory';
import { GraphQLCacheService } from './GraphQLCacheService';
import { UserService } from '.';

const ARTICLE_FIELDS = `
    _id
    breedName
    petName
    petAge
    isMale
    createDate
    imageId
    articleText
    userId
    userName
    userPhotoUrl
    regionName
    likedBy
`

const NEW_ARTICLE_MUTATION = gql`
  mutation NewArticleMutation(
        $breedId: Int!,
        $petName: String!,
        $petAge: Int,
        $isMale: Boolean,
        $regionId: ID!
        $imageId: ID!,
        $articleText: String,
        $userToken: String!) {
    createArticle(articleInput: {
        breedId: $breedId,
        petName: $petName,
        petAge: $petAge,
        isMale: $isMale,
        regionId: $regionId,
        imageId: $imageId,
        articleText: $articleText,
        userToken: $userToken
    }) {
      breedId
    }
  }
`

const ARTICLES_QUERY = gql`
    query Articles($lastDisplayedId: ID, $sex: String, $breedId: Int, $regionId: Int, $userId: ID, $likedByToken: String) {
        articles(lastDisplayedId: $lastDisplayedId, sex: $sex, breedId: $breedId, regionId: $regionId, userId: $userId, likedByToken: $likedByToken) {
            ${ARTICLE_FIELDS}
        }
    }
`

export const ARTICLE_QUERY = gql`
    query Article($articleId: ID) {
        article(articleId: $articleId) {
            ${ARTICLE_FIELDS}
        }
    }
`

const DELETE_ARTICLE_MUTATION = gql`
    mutation DeleteArticleMutation(
        $articleId: ID!,
        $userToken: String!
    ) {
        deleteArticle(articleId: $articleId,userToken: $userToken) {
            ${ARTICLE_FIELDS}
        }
    }
`

const RENEW_ARTICE_MUTATION = gql`
    mutation RenewArticleMutation(
        $articleId: ID!,
        $userToken: String!
    ) {
        renewArticle(articleId: $articleId, userToken: $userToken) {
            ${ARTICLE_FIELDS}
        }
    }
`

const ADD_OR_REMOVE_LIKE_MUTATION = gql`
    mutation AddOrRemoveLikeMutation(
        $articleId: ID!,
        $userToken: String!,
        $isAdd: Boolean
    ) {
        addOrRemoveLike(articleId: $articleId, userToken: $userToken, isAdd: $isAdd){
            ${ARTICLE_FIELDS}
        }
    }
`

interface ArticleListQueryResponse {
    articles: Article[]
}
interface ArticleQueryResponse {
    article: Article
}
interface RenewArticleMutationResponse {
    renewArticle: Article
}
interface AddOrRemoveLikeMutationResponse {
    addOrRemoveLike: Article
}

export interface ArticleListFilter {
    sex?: string
    breedId?: number
    regionId?: number
    userId?: string
    likedByUser?: boolean
}

export class ArticleService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>, 
        private cacheService: GraphQLCacheService,
        private userService: UserService) {}

    public addArticle(article: ArticleInput ): Promise<Article> {
        const result = this.apolloClient.mutate({mutation: NEW_ARTICLE_MUTATION, variables: {
                breedId: article.breedId,
                petName: article.petName,
                petAge: article.petAge,
                isMale: article.isMale,
                regionId: article.regionId,
                imageId: article.imageId,
                articleText: article.articleText,
                userToken: article.userToken
            }}) as Promise<Article>

        this.apolloClient.resetStore()
        return result
    }

    public async loadArticles(lastDisplayedId?: string, filter?: ArticleListFilter): Promise<Article[]> {
        const token = filter && filter.likedByUser && await this.userService.getCurrentUserToken()
        const sendFilter = (filter && {
            sex: filter.sex, 
            breedId: filter.breedId, 
            regionId: filter.regionId, 
            userId: filter.userId,
            likedByToken: token
        }) || {}
        const response = await this.apolloClient
            .query<ArticleListQueryResponse>({
                query: ARTICLES_QUERY, 
                variables: { 
                    lastDisplayedId: lastDisplayedId, 
                    ...sendFilter
                }
            })
        if(response.errors) {
            throw new Error("Problem when loading articles: " + response.errors)
        }
        return response.data.articles as Article[]
    }

    public async loadArticleById(articleId: string): Promise<Article> {
        const response = await this.apolloClient
            .query<ArticleQueryResponse>({query: ARTICLE_QUERY, variables: {'articleId': articleId}})
        if(response.errors) {
            throw new Error("Problem when loading articles: " + response.errors)
        }
        return response.data.article as Article
    }

    public async deleteArticle(articleId: string, userToken: string): Promise<void> {
        return this.apolloClient.mutate({
            mutation: DELETE_ARTICLE_MUTATION, 
            variables: {
                articleId, userToken
            }
        }).then(_ => {
            this.cacheService.removeArticleFromCache(articleId)
        })
    }

    public async renewArticle(articleId: string, userToken: string): Promise<Article> {
        const response = await this.apolloClient.mutate<RenewArticleMutationResponse>({
            mutation: RENEW_ARTICE_MUTATION,
            variables: { articleId, userToken }
        })
        if(response.errors) {
            throw new Error(`Error when renewing article: ${response.errors}`)
        }
        const result = response.data!.renewArticle as Article
        this.cacheService.renewArticleInCache(result)
        return result
    }

    public async addOrRemoveLike(articleId: string, userToken: string, isAdd: boolean): Promise<Article> {
        const response = await this.apolloClient.mutate<AddOrRemoveLikeMutationResponse>({
            mutation: ADD_OR_REMOVE_LIKE_MUTATION,
            variables: { articleId, userToken, isAdd }
        })
        if(response.errors) {
            throw new Error(`Error when adding or removing like: ${response.errors}`)
        }
        const result = response.data!.addOrRemoveLike as Article
        this.cacheService.renewArticleInCache(result)
        return result
    }
}