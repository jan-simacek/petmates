import * as admin from 'firebase-admin'
import { Article, ArticleInput } from '../model';
import { BreedsService } from './BreedsService';
import { UserService } from './UserService';

const PAGE_SIZE = 3

export class ArticlesService {
    constructor(private breedsService: BreedsService, private userService: UserService){}

    public async loadArticleById(articleId: string): Promise<Article> {
        const article = await this.loadArticleDocById(articleId)
        return this.articleDataToArticle(article)
    }

    private async loadArticleDocById(id: string): Promise<any> {
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
            const lastDisplayedArticle = await this.loadArticleDocById(lastDisplayedArticleId)
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
        const user = await this.userService.resolveUser(articleInput.userToken)
        const dateNow = Date.now()

        const docData = {
            petName: articleInput.petName,
            petAge: articleInput.petAge,
            isMale: articleInput.isMale,
            imageId: articleInput.imageId,
            articleText: articleInput.articleText,
            createDate: dateNow,
            breedId: articleInput.breedId,
            breedName: breed.breedName,
            userId: user.uid,
            userName: user.displayName,
            userPhotoUrl: user.photoURL
        }
        const docRef = await admin
            .firestore()
            .collection('articles')
            .add(docData)
        return {
            ...docData,
            _id: docRef.id,
            createDate: new Date(dateNow)
        }
    }
}