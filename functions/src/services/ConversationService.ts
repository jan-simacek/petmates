import * as admin from 'firebase-admin'
import { Conversation, ConversationDb } from "../model";
import { UserService, MessageDeletionService } from '.';
import { QueryDocumentSnapshot } from '@google-cloud/firestore';

const PAGE_SIZE = 20

export class ConversationService {
    private readonly firestore = admin.firestore();

    constructor(private userService: UserService, private messagesService: MessageDeletionService) {}

    public async loadConversations(userToken: string, lastDisplayedId?: string): Promise<Conversation[]> {
        const user = await this.userService.resolveUser(userToken)
        let query = this.firestore
            .collection('conversations')
            .orderBy("lastUpdate", 'desc')
            .where('participantUids', 'array-contains', user.uid)

        if(lastDisplayedId) {
            const lastDisplayedConversation = await this.loadConversationDocById(lastDisplayedId)
            query = query.startAfter(lastDisplayedConversation)
        }

        const conversationDocs = await query
            .limit(PAGE_SIZE)
            .get()
        const conversationPromisses = conversationDocs.docs.map(
            async conversation => this.conversationDocToConversation(conversation, user.uid)
        )

        return await Promise.all(conversationPromisses)
    }

    public async loadConversationById(conversationId: string, currentUserUid: string): Promise<Conversation> {
        const conversationDoc = await this.loadConversationDocById(conversationId)
        return await this.conversationDocToConversation(conversationDoc, currentUserUid)
    }

    private async loadConversationDocById(id: string): Promise<QueryDocumentSnapshot> {
        const conversations = await this.firestore
            .collection('conversations')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get()
        if(conversations.docs.length == 0) {
            throw new Error(`Conversation ${id} not found`)
        }
        return conversations.docs[0]
    }

    private async conversationDocToConversation(conversationDoc: QueryDocumentSnapshot, currentUserUid: string): Promise<Conversation>{
        const conversationDb = conversationDoc.data() as ConversationDb

        if(conversationDb.participantUids.indexOf(currentUserUid) < 0) {
            throw new Error(`Current user is not a participant in conversation ${conversationDoc.id}`)
        }

        const otherParticipant = conversationDb.participants.find(participant => participant.uid != currentUserUid)
        const lastConversationDocList = await this.firestore
            .collection('messages')
            .where('type', '==', 'text')
            .where('conversationId', '==', conversationDoc.id)
            .orderBy('createDate', 'desc')
            .limit(1)
            .get()

        let lastMessage = undefined
        if(lastConversationDocList.docs.length > 0) {
            lastMessage = lastConversationDocList.docs[0].data().content
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

    public async deleteConversation(conversationId: string, userToken: string): Promise<Conversation> {
        const user = await this.userService.resolveUser(userToken)
        const conversationDoc = await this.loadConversationDocById(conversationId)
        const conversationDb = conversationDoc.data() as ConversationDb
        const index = conversationDb.participantUids.indexOf(user.uid)
        if(index < 0) {
            throw new Error(`Only participants can delete conversation`)
        }
        const newParticipantUids = conversationDb.participantUids.slice()
        newParticipantUids.splice(index, 1)
        await this.firestore
            .collection('conversations')
            .doc(conversationId)
            .update({participantUids: newParticipantUids})

        if(newParticipantUids.length == 0) {
            this.purgeConversationAndMessages(conversationId)
        }

        return await this.conversationDocToConversation(conversationDoc, user.uid)
    }

    private async purgeConversationAndMessages(conversationId: string): Promise<any> {
        await this.messagesService.deleteConversationMessages(conversationId)
        const docRef = this.firestore
            .collection('conversations')
            .doc(conversationId)
        await docRef
            .update({participantUids: [], participants: []})
        return docRef.delete()
    }
}