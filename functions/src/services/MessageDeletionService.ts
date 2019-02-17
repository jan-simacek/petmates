import * as admin from 'firebase-admin'
import { QuerySnapshot } from '@google-cloud/firestore';

const DELETE_BATCH_SIZE = 100

export class MessageDeletionService {
    private readonly firestore = admin.firestore();

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
}