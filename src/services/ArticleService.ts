import { ApolloClient } from 'apollo-client'
import {Article, ArticleInput} from "../model";
import gql from "graphql-tag";
import {NormalizedCacheObject} from 'apollo-cache-inmemory';
import { Query, QueryProps } from 'react-apollo';

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
    query Articles($lastDisplayedId: ID, $sex: String, $breedId: Int, $regionId: Int, $userId: ID) {
        articles(lastDisplayedId: $lastDisplayedId, sex: $sex, breedId: $breedId, regionId: $regionId, userId: $userId) {
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
        }
    }
`

export const ARTICLE_QUERY = gql`
    query Article($articleId: ID) {
        article(articleId: $articleId) {
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
        }
    }
`

const DELETE_ARTICLE_MUTATION = gql`
    mutation DeleteArticleMutation(
        $articleId: ID!,
        $userToken: String!
    ) {
        deleteArticle(articleId: $articleId,userToken: $userToken) {
            articleId
        }
    }
`

interface ArticleListQueryResponse {
    articles: Article[]
}
interface ArticleQueryResponse {
    article: Article
}

export interface ArticleListFilter {
    sex?: string
    breedId?: number
    regionId?: number
    userId?: string
}

export class ArticleService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>) {}

    public addArticle(article: ArticleInput ): Promise<Article> {
        return this.apolloClient.mutate({mutation: NEW_ARTICLE_MUTATION, variables: {
                breedId: article.breedId,
                petName: article.petName,
                petAge: article.petAge,
                isMale: article.isMale,
                regionId: article.regionId,
                imageId: article.imageId,
                articleText: article.articleText,
                userToken: article.userToken
            }}) as Promise<Article>
    }

    public async loadArticles(lastDisplayedId?: string, filter?: ArticleListFilter): Promise<Article[]> {
        const response = await this.apolloClient
            .query<ArticleListQueryResponse>({
                query: ARTICLES_QUERY, 
                variables: { 
                    lastDisplayedId: lastDisplayedId, 
                    ...filter
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
        this.apolloClient.mutate({mutation: DELETE_ARTICLE_MUTATION, variables: {
            articleId, userToken
        }})
    }
}