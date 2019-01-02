import * as admin from 'firebase-admin'
import { Article, ArticleInput } from '../model';
import { BreedsService } from './BreedsService';


export class ArticlesService {
    constructor(private breedsService: BreedsService){}

    public async loadAllArticles(): Promise<Article[]> {
        const articles = await admin
            .firestore()
            .collection('articles')
            .orderBy("createDate", 'desc')
            .get()
        return articles.docs.map(article =>{ return {...article.data(), "_id": article.id} }) as Article[]
    }

    public async createArticle(articleInput: ArticleInput): Promise<Article> {
        const allBreeds = await this.breedsService.loadAllBreeds()
        const breed = allBreeds.find(breed => breed.breedId == (+articleInput.breedId))
        let docData = JSON.parse(JSON.stringify(articleInput))
        const createDate = Date.now()
        docData["createDate"] = createDate
        docData["breedName"] = breed.breedName
        const docRef = await admin
            .firestore()
            .collection('articles')
            .add(docData)
        return {
            _id: docRef.id,
            createDate: new Date(createDate),
            breedName: breed.breedName,
            ...articleInput
        }
    }
}