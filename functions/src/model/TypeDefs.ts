import { gql } from "apollo-server-express";
import * as Article from './Article'
import * as Breed from './Breed'

export const typeDefs = gql`
    scalar Date
    ${Article.articleTypeDef}
    ${Breed.breedTypeDef}
    type Query {
        breeds: [Breed]
        articles: [Article]
    }
   
    type Mutation {
        createArticle(articleInput: ArticleInput): Article
    }
`