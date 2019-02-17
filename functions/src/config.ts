import { BreedsService, ResolverService, UserService, ConversationService, RegionsService, ArticlesService, StorageService, MessageDeletionService, MessagesService } from './services'
import { serviceAccount } from './ServiceAccount'
import {ServiceAccount} from "firebase-admin";
import * as admin from 'firebase-admin';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: 'petmates-2b6fe.appspot.com'
})

export const breedsService = new BreedsService() 
export const userService = new UserService()
export const regionsService = new RegionsService()
export const articlesService = new ArticlesService(breedsService, userService, regionsService)
export const storageService = new StorageService()
export const messageDeletionService = new MessageDeletionService()
export const conversationService = new ConversationService(userService, messageDeletionService)
export const messagesService = new MessagesService(userService, conversationService)
export const resolversService = new ResolverService(breedsService, articlesService, regionsService, storageService, userService, conversationService, messagesService)