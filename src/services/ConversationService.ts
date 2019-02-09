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

export class ConversationService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>, 
        private userService: UserService) {}

    public async loadConversations(lastDisplayedId?: string): Promise<Conversation[]> {
        const userToken = await this.userService.getCurrentUserToken()
        const variables = { lastDisplayedId, userToken }
        const response = await this.apolloClient.query<ConversationResponse>({
            query: CONVERSATION_QUERY,
            variables
        })
        if(response.errors) {
            throw new Error(`Problem when loading conversations: ${response.errors}`)
        }
        return response.data.conversations as Conversation[]
    }

}