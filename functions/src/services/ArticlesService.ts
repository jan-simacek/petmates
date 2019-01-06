import * as admin from 'firebase-admin'
import { Article, ArticleInput } from '../model';
import { BreedsService } from './BreedsService';

const PAGE_SIZE = 3

export class ArticlesService {
    constructor(private breedsService: BreedsService){}

    public async loadArticleById(id: string): Promise<any> {
        const articles = await admin
            .firestore()
            .collection('articles')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get()
        if(articles.docs.length == 0) {
            return null
        }
        return articles.docs[0]
    }

    public async loadAllArticles(lastDisplayedArticleId: string): Promise<Article[]> {
        let query = admin
            .firestore()
            .collection('articles')
            .orderBy("createDate", 'desc')

        if(lastDisplayedArticleId) {
            const lastDisplayedArticle = await this.loadArticleById(lastDisplayedArticleId)
            query = query.startAfter(lastDisplayedArticle)
        }

        const articles = await query
            .limit(PAGE_SIZE)
            .get()
        return articles.docs.map(article => this.articleDataToArticle(article)) as Article[]
    }

    private articleDataToArticle(articleData: any): Article {
        return {...articleData.data(), "_id": articleData.id }  as Article
    }

    public async createArticle(articleInput: ArticleInput): Promise<Article> {
        const allBreeds = await this.breedsService.loadAllBreeds()
        const breed = allBreeds.find(breed => breed.breedId == (+articleInput.breedId))
        let docData = ArticlesService.toJSON(articleInput)
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

    private static toJSON(obj: any): any {
        JSON.parse(JSON.stringify(obj))
    }
}