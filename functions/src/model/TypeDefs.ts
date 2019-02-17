import { gql } from "apollo-server-express";
import * as Article from './Article'
import * as Breed from './Breed'
import * as Region from './Region'
import * as Conversation from './Conversation'
import * as Message from './Message'

export const typeDefs = gql`
    scalar Date
    ${Article.articleTypeDef}
    ${Breed.breedTypeDef}
    ${Region.regionTypeDef}
    ${Conversation.conversationTypeDef}
    ${Message.messageTypeDef}
    type Query {
        breeds: [Breed]
        articles(lastDisplayedId: ID, sex: String, breedId: Int, regionId: Int, userId: ID, likedByToken: String): [Article]
        article(articleId: ID): Article
        regions: [Region]
        conversations(lastDisplayedId: ID, userToken: String!): [Conversation]
        messages(conversationId: ID!, userToken: String!, lastDisplayedId: ID): [Message]
    }
   
    type Mutation {
        createArticle(articleInput: ArticleInput): Article
        deleteArticle(articleId: ID!, userToken: String!): Article
        renewArticle(articleId: ID!, userToken: String!): Article
        addOrRemoveLike(articleId: ID!, userToken: String!, isAdd: Boolean): Article
        deleteConversation(conversationId: ID!, userToken: String!): Conversation
    }
`