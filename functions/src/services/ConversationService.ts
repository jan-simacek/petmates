import * as admin from 'firebase-admin'
import { Conversation, ConversationDb } from "../model";
import { UserService } from '.';

const PAGE_SIZE = 20

export class ConversationService {
    private readonly firestore = admin.firestore();

    constructor(private userService: UserService) {}

    public async loadConversations(userToken: string, lastDisplayedId?: string): Promise<Conversation[]> {
        const user = await this.userService.resolveUser(userToken)
        const query = this.firestore
            .collection('conversations')
            .where('participantUids', 'array-contains', user.uid)
            .orderBy("createDate", 'desc')

        if(lastDisplayedId) {
            const lastDisplayedConversation = this.loadConversationById(lastDisplayedId)
            query.startAfter(lastDisplayedConversation)
        }

        const conversationDocs = await query
            .limit(PAGE_SIZE)
            .get()
        return conversationDocs.docs.map(conversation => this.conversationDocToConversation(conversation, user.uid))
    }

    private async loadConversationById(id: string): Promise<any> {
        const conversations = await this.firestore
            .collection('conversations')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get()
        if(conversations.docs.length == 0) {
            throw new Error(`Conversation ${id} not found`)
        }

        return conversations.docs[0]
    }

    private conversationDocToConversation(conversationDoc: any, currentUserUid: string): Conversation{
        const conversationDb = conversationDoc.data() as ConversationDb

        const otherParticipant = conversationDb.participants.find(participant => participant.uid != currentUserUid)
        const lastConversationDocList = conversationDoc
            .collection('messages')
            .where('type', '==', 'text')
            .orderBy('createDate', 'desc')
            .limit(1)
            .get()

        let lastMessage = undefined
        if(lastConversationDocList.docs.length > 0) {
            lastMessage = lastConversationDocList.docs[0].content
        }
        return {
            "_id": conversationDoc.id,
            lastUpdate: new Date(conversationDb.lastUpdate),
            otherUid: otherParticipant.uid,
            otherUserName: otherParticipant.userName,
            otherUserPhotoUrl: otherParticipant.userPhotoUrl,
            lastMessage
        }
    }
}