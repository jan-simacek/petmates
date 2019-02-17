import * as admin from 'firebase-admin'
import { QuerySnapshot, QueryDocumentSnapshot, DocumentSnapshot } from '@google-cloud/firestore';
import { Message, MessageType } from '../model';
import { UserService } from './UserService';
import { ConversationService } from './ConversationService';

const LOAD_PAGE_SIZE = 20

export class MessagesService {
    private readonly firestore = admin.firestore();
    constructor(private userService: UserService, private conversationService: ConversationService) {}

    private async loadMessageDocById(messageId: string): Promise<DocumentSnapshot> {
        return await this.firestore.collection('messages').doc(messageId).get()
    }

    private messageDocToMessage(messageDoc: QueryDocumentSnapshot): Message {
        return {
            ...messageDoc.data(),
            _id: messageDoc.id,
            createDate: new Date(messageDoc.data().createDate)
        } as Message
    }

    public async loadMessages(conversationId: string, userToken: string, lastDisplayedId?: string): Promise<Message[]> {
        const user = await this.userService.resolveUser(userToken)

        let query = this.firestore
            .collection('messages')
            .where('conversationId', '==', conversationId)
            .orderBy('createDate', 'desc')
            .limit(LOAD_PAGE_SIZE)

        if(lastDisplayedId) {
            const messageDoc = await this.loadMessageDocById(lastDisplayedId)
            query = query.startAfter(messageDoc)
        }

        const resultDocs = await query.get()
        const resultMessages = resultDocs.docs.map((doc: QueryDocumentSnapshot) => this.messageDocToMessage(doc))
        if(resultMessages.find((msg: Message) => msg.fromUid != user.uid && msg.toUid != user.uid)) {
            throw new Error(`Only users participating in a conversation can read it`)
        }

        return resultMessages
    }

    public async createTextMessage(conversationId: string, userToken: string, content: string): Promise<Message> {
        const user = await this.userService.resolveUser(userToken)
        const conversation = await this.conversationService.loadConversationById(conversationId, user.uid)

        const docData = {
            content, 
            conversationId,
            fromUid: user.uid,
            toUid: conversation.otherUid,
            type: MessageType.text,
            createDate: Date.now()
        }

        const docRef = await this.firestore
            .collection('messages')
            .add(docData)

        return {
            ...docData,
            _id: docRef.id,
            createDate: new Date(docData.createDate)
        }
    }
}