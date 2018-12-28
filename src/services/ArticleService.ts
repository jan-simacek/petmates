import { ApolloClient } from 'apollo-client'
import {Article} from "../model";
import gql from "graphql-tag";
import {NormalizedCacheObject} from 'apollo-cache-inmemory';

const NEW_ARTICLE_MUTATION = gql`
  mutation NewArticleMutation($breedName: String,
        $breedId: ID!,
        $petName: String!,
        $age: Int,
        $isMale: Boolean) {
    createArticle(articleInput: {
        breedName: $breedName,
        breedId: $breedId,
        petName: $petName,
        age: $age,
        isMale: $isMale
    }) {
      breedId
    }
  }
`

export class ArticleService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>) {}

    public addArticle(article: Article): Promise<Article> {
        return this.apolloClient.mutate({mutation: NEW_ARTICLE_MUTATION, variables: {
                breedId: 4,
                petName: article.petName,
                age: article.petAge,
                isMale: article.isMale
            }}) as Promise<Article>
    }
}