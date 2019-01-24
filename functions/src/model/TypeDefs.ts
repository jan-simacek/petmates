import { gql } from "apollo-server-express";
import * as Article from './Article'
import * as Breed from './Breed'
import * as Region from './Region'

export const typeDefs = gql`
    scalar Date
    ${Article.articleTypeDef}
    ${Breed.breedTypeDef}
    ${Region.regionTypeDef}
    type Query {
        breeds: [Breed]
        articles(lastDisplayedId: ID, sex: String, breedId: Int, regionId: Int, userId: ID): [Article]
        article(articleId: ID): Article
        regions: [Region]
    }
   
    type Mutation {
        createArticle(articleInput: ArticleInput): Article
        deleteArticle(articleId: ID!, userToken: String!): Article
    }
`