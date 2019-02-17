export enum MessageType {
    text = 'text'
}

export interface Message {
    _id: string
    conversationId: string
    fromUid: string
    toUid: string
    createDate: Date
    type: MessageType
    content: string
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