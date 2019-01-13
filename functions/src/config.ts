import { BreedsService, ResolverService, UserService } from './services'
import { ArticlesService } from './services/ArticlesService';
import { RegionsService } from './services/RegionsService';

export const breedsService = new BreedsService() 
export const userService = new UserService()
export const regionsService = new RegionsService()
export const articlesService = new ArticlesService(breedsService, userService, regionsService)
export const resolversService = new ResolverService(breedsService, articlesService, regionsService)