import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { GraphQLCacheService, UserService } from ".";
import { Conversation } from "../model";
import gql from "graphql-tag";

interface ConversationResponse {
    conversations: Array<Conversation>
}   

export const conversationFields = `
    _id 
    otherUid
    otherUserName
    otherUserPhotoUrl
    lastUpdate
    lastMessage
`

const CONVERSATION_QUERY = gql`
    query Conversations($lastDisplayedId: ID, $userToken: String!) {
        conversations(lastDisplayedId: $lastDisplayedId, userToken: $userToken) {
            ${conversationFields}
        }
    }
`

interface DeleteConversationResponse {
    deleteConversation: Conversation
}

const DELETE_CONVERSATION_MUTATION = gql`
    mutation DeleteConversation($conversationId: ID!, $userToken: String!) {
        deleteConversation(conversationId: $conversationId, userToken: $userToken) {
            ${conversationFields}
        }
    }
`

export class ConversationService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>, 
        private userService: UserService,
        private graphqlCacheService: GraphQLCacheService) {}

    public async loadConversations(lastDisplayedId?: string): Promise<Conversation[]> {
        const userToken = await this.userService.getCurrentUserToken()
        const response = await this.apolloClient.query<ConversationResponse>({
            query: CONVERSATION_QUERY,
            variables: { lastDisplayedId, userToken }
        })
        if(response.errors) {
            throw new Error(`Problem when loading conversations: ${response.errors}`)
        }
        return response.data.conversations as Conversation[]
    }

    public async deleteConversation(conversationId: string): Promise<Conversation> {
        const userToken = await this.userService.getCurrentUserToken()
        const response = await this.apolloClient.mutate<DeleteConversationResponse>({
            mutation: DELETE_CONVERSATION_MUTATION, 
            variables: {conversationId, userToken}
        })
        if(response.errors) {
            throw new Error(`Problem when deleting conversation: ${response.errors}`)
        }
        this.graphqlCacheService.removeConversationFromCache(conversationId)
        return response.data!.deleteConversation as Conversation
    }

}