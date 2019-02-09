import { BreedsService, ResolverService, UserService, ConversationService } from './services'
import { ArticlesService } from './services/ArticlesService';
import { RegionsService } from './services/RegionsService';
import { serviceAccount } from './ServiceAccount'
import {ServiceAccount} from "firebase-admin";
import * as admin from 'firebase-admin';
import { StorageService } from './services/StorageService';
import { MessagesService } from './services/MessagesService';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: 'petmates-2b6fe.appspot.com'
})

export const breedsService = new BreedsService() 
export const userService = new UserService()
export const regionsService = new RegionsService()
export const articlesService = new ArticlesService(breedsService, userService, regionsService)
export const storageService = new StorageService()
export const messagesService = new MessagesService()
export const conversationService = new ConversationService(userService, messagesService)
export const resolversService = new ResolverService(breedsService, articlesService, regionsService, storageService, userService, conversationService)