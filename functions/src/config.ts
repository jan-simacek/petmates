import { BreedsService, ResolverService, UserService } from './services'
import { ArticlesService } from './services/ArticlesService';

export const breedsService = new BreedsService() 
export const userService = new UserService()
export const articlesService = new ArticlesService(breedsService, userService)
export const resolversService = new ResolverService(breedsService, articlesService)