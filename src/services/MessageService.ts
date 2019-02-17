import gql from "graphql-tag";
import { Message, MessageInput } from "../model";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { GraphQLCacheService, UserService } from ".";

const MESSAGE_FIELDS = `
    _id
    conversationId
    fromUid
    toUid
    createDate
    type
    content
`

export const MESSAGES_QUERY = gql`
    query Messages($conversationId: ID!, $userToken: String!, $lastDisplayedId: ID) {
        messages(conversationId: $conversationId, userToken: $userToken, lastDisplayedId: $lastDisplayedId) {
            ${MESSAGE_FIELDS}
        }
    }
`

const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateTextMessage($conversationId: ID!, $userToken: String!, $content: String) {
        createTextMessage(conversationId: $conversationId, userToken: $userToken, content: $content) {
            ${MESSAGE_FIELDS}
        }
    }
`

interface MessagesQueryResponse {
    messages: Message[]
}

interface CreateTextMessageResponse {
    createTextMessage: Message
}

export class MessageService {
    constructor(private apolloClient: ApolloClient<NormalizedCacheObject>, 
        private cacheService: GraphQLCacheService,
        private userService: UserService) {}

    public async loadMessages(conversationId: string, lastDisplayedId?: string): Promise<Message[]> {
        const userToken = await this.userService.getCurrentUserToken()

        let response = await this.apolloClient.query<MessagesQueryResponse>({
            query: MESSAGES_QUERY,
            variables: {
                conversationId, 
                userToken,
                lastDisplayedId: lastDisplayedId
            }
        })

        if(response.errors) {
            throw new Error("" + response.errors)
        }

        return response.data.messages as Message[]
    }

    public async addTextMessage(messageInput: MessageInput): Promise<Message> {
        const userToken = await this.userService.getCurrentUserToken()

        let response = await this.apolloClient.mutate<CreateTextMessageResponse>({
            mutation: CREATE_MESSAGE_MUTATION,
            variables: {
                conversationId: messageInput.conversationId,
                userToken,
                content: messageInput.content
            }
        })

        return response.data!.createTextMessage as Message
    }
}