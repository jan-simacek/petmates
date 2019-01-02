import { ApolloClient } from 'apollo-client'
import {Article, ArticleInput} from "../model";
import gql from "graphql-tag";
import {NormalizedCacheObject} from 'apollo-cache-inmemory';

const NEW_ARTICLE_MUTATION = gql`
  mutation NewArticleMutation(
        $breedId: ID!,
        $petName: String!,
        $age: Int,
        $isMale: Boolean,
        $imageId: ID!) {
    createArticle(articleInput: {
        breedId: $breedId,
        petName: $petName,
        age: $age,
        isMale: $isMale,
        imageId: $imageId
    }) {
      breedId
    }
  }
`

export class ArticleService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>) {}

    public addArticle(article: ArticleInput ): Promise<Article> {
        return this.apolloClient.mutate({mutation: NEW_ARTICLE_MUTATION, variables: {
                breedId: 4,
                petName: article.petName,
                age: article.petAge,
                isMale: article.isMale,
                imageId: article.imageId
            }}) as Promise<Article>
    }
}