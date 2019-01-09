import { UserRecord } from "firebase-functions/lib/providers/auth";
import * as admin from 'firebase-admin'

export class UserService {
    public async resolveUser(token: string): Promise<UserRecord> {
        const decodedToken = await admin.auth().verifyIdToken(token) 
        return admin.auth().getUser(decodedToken.uid)
    }
}