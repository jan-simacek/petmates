import { gql } from "apollo-server-express";
import * as Article from './Article'
import * as Breed from './Breed'

export const typeDefs = gql`
    scalar Date
    ${Article.articleTypeDef}
    ${Breed.breedTypeDef}
    type Query {
        breeds: [Breed]
        articles(lastDisplayedId: ID, sex: String, breedId: String): [Article]
        article(articleId: ID): Article
    }
   
    type Mutation {
        createArticle(articleInput: ArticleInput): Article
    }
`