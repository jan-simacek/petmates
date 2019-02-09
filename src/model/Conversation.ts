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