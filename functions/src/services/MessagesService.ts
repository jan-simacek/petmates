import * as admin from 'firebase-admin'
import { QuerySnapshot, QueryDocumentSnapshot, DocumentSnapshot } from '@google-cloud/firestore';
import { Message } from '../model';
import { UserService } from './UserService';

const DELETE_BATCH_SIZE = 100
const LOAD_PAGE_SIZE = 20

export class MessagesService {
    private readonly firestore = admin.firestore();
    constructor(private userService: UserService) {}

    public async deleteConversationMessages(conversationId: string): Promise<any> {
        let batch: QuerySnapshot = undefined
        do {
            batch = await this.firestore
                .collection('messages')
                .where('conversationId', '==', conversationId)
                .limit(DELETE_BATCH_SIZE)
                .get()
            
            await Promise.all(batch.docs.map(doc => this.firestore.collection('messages').doc(doc.id).delete()))
        } while(batch.docs.length > 0)
    }

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
        console.log(`lastDisplayedID: ${lastDisplayedId}`)
        const user = await this.userService.resolveUser(userToken)

        let query = this.firestore
            .collection('messages')
            .where('conversationId', '==', conversationId)
            .orderBy('createDate', 'desc')
            .limit(LOAD_PAGE_SIZE)

        if(lastDisplayedId) {
            const messageDoc = await this.loadMessageDocById(lastDisplayedId)
            console.log(`messageDoc: ${JSON.stringify(messageDoc)}`)
            query = query.startAfter(messageDoc)
        }

        const resultDocs = await query.get()
        const resultMessages = resultDocs.docs.map((doc: QueryDocumentSnapshot) => this.messageDocToMessage(doc))
        if(resultMessages.find((msg: Message) => msg.fromUid != user.uid && msg.toUid != user.uid)) {
            throw new Error(`Only users participating in a conversation can read it`)
        }

        return resultMessages
    }
}