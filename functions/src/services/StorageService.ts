import * as admin from 'firebase-admin'

export class StorageService {
    private storage = admin.storage().bucket()
    
    public async deleteImage(imageUrl: string, currentUserId: string): Promise<[any]> {
        const match = /([a-zA-Z0-9!@#$%&*()-_]+)\/([^\/]+)/g.exec(imageUrl)
        if(!match) {
            throw new Error(`Invalid file path ${imageUrl}`)
        }

        if(match[1] != currentUserId) {
            throw new Error(`Access denied`)
        }

        return this.storage.file(`user-images/${imageUrl}`).delete()
    }

}