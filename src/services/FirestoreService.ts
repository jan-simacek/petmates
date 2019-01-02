import firebase from 'firebase'

export class FirestoreService {
    public getImageDownloadUrl(fileName: string): Promise<string> {
        return firebase.storage().ref('user-images')
        .child(fileName)
        .getDownloadURL()
    }
}

export const firestoreService = new FirestoreService()