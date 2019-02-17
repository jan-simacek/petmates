export enum MessageType {
    text = 'text'
}

export interface MessageInput {
    conversationId: string
    content: string
}

export interface Message extends MessageInput {
    _id: string
    fromUid: string
    toUid: string
    createDate: Date
    type: MessageType
}

export const messageFields = `
    _id: ID!
    conversationId: ID!
    fromUid: ID!
    toUid: ID!
    createDate: Date!
    type: String!
    content: String
`