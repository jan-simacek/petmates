import { BreedsService, ResolverService } from './services'
import { ArticlesService } from './services/ArticlesService';

export const breedsService = new BreedsService() 
export const articlesService = new ArticlesService(breedsService)
export const resolversService = new ResolverService(breedsService, articlesService)