import * as admin from 'firebase-admin'
import firebase from 'firebase'
import { Article, ArticleInput } from '../model';
import { BreedsService } from './BreedsService';

const PAGE_SIZE = 5

export class ArticlesService {
    constructor(private breedsService: BreedsService){}

    public async loadArticleById(id: string): Promise<Article> {
        const articles = await admin
            .firestore()
            .collection('articles')
            .where(firebase.firestore.FieldPath.documentId(), '==', id)
            .get()
        if(articles.docs.length == 0) {
            return null
        }
        return this.articleDataToArticle(articles.docs[0])
    }

    public async loadAllArticles(lastDisplayedArticleId: string): Promise<Article[]> {
        const lastDisplayedArticle = this.loadArticleById(lastDisplayedArticleId)

        const articles = await admin
            .firestore()
            .collection('articles')
            .orderBy("createDate", 'desc')
            .startAfter(lastDisplayedArticle)
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