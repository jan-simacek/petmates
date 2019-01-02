import { BreedsService, ResolverService } from './services'

export const breedsService = new BreedsService() 
export const resolversService = new ResolverService(breedsService)