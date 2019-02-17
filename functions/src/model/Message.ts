export enum MessageType {
    text = 'text'
}

export interface Message {
    _id: string
    fromUid: string
    toUid: string
    createDate: Date
    type: MessageType
    conversationId: string
    content: string
}

export const messageTypeDef = `
type Message {
    _id: ID!
    conversationId: ID!
    fromUid: ID!
    toUid: ID!
    createDate: Date!
    type: String!
    content: String
}
`