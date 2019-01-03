import { ApolloClient } from 'apollo-client'
import {Article, ArticleInput} from "../model";
import gql from "graphql-tag";
import {NormalizedCacheObject} from 'apollo-cache-inmemory';

const NEW_ARTICLE_MUTATION = gql`
  mutation NewArticleMutation(
        $breedId: ID!,
        $petName: String!,
        $petAge: Int,
        $isMale: Boolean,
        $imageId: ID!,
        $articleText: String) {
    createArticle(articleInput: {
        breedId: $breedId,
        petName: $petName,
        petAge: $petAge,
        isMale: $isMale,
        imageId: $imageId,
        articleText: $articleText
    }) {
      breedId
    }
  }
`

export class ArticleService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>) {}

    public addArticle(article: ArticleInput ): Promise<Article> {
        return this.apolloClient.mutate({mutation: NEW_ARTICLE_MUTATION, variables: {
                breedId: article.breedId,
                petName: article.petName,
                petAge: article.petAge,
                isMale: article.isMale,
                imageId: article.imageId,
                articleText: article.articleText
            }}) as Promise<Article>
    }
}