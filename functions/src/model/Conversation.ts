export interface Conversation {
    _id: string
    otherUid: string
    otherUserName: string
    otherUserPhotoUrl?: string
    lastUpdate: Date
    lastMessage: string
}

export const conversationFields = `
    _id: ID!
    otherUid: String
    otherUserName: String
    otherUserPhotoUrl: String
    lastUpdate: Date
    lastMessage: String
`

export const conversationTypeDef = `
type Conversation {
    ${conversationFields}
}`

export interface ConversationDb { 
    _id: string
    participantUids: string[]
    participants: ConversationParticipantDb[]
    lastUpdate: number
}

export interface ConversationParticipantDb {
    uid: string
    userName: string
    userPhotoUrl: string
}