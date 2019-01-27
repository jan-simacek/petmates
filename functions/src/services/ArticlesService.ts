import * as admin from 'firebase-admin'
import { Article, ArticleInput, Region } from '../model';
import { BreedsService } from './BreedsService';
import { UserService } from './UserService';
import { RegionsService } from './RegionsService';
import { FieldValue } from '@google-cloud/firestore';

const PAGE_SIZE = 3

interface ArticleFilter {
    sex?: string
    breedId?: number
    regionId?: number
    userId?: string
}

export class ArticlesService {
    private readonly firestore = admin.firestore();
    
    constructor(private breedsService: BreedsService, 
        private userService: UserService,
        private regionsService: RegionsService){ }

    public async loadArticleById(articleId: string): Promise<Article> {
        const articleDoc = await this.loadArticleDocById(articleId)
        return await this.articleDocToArticle(articleDoc)
    }

    private async articleDocToArticle(articleDoc: any): Promise<Article> {
        return (await this.addRegionNameToArticles([this.articleDataToArticle(articleDoc)]))[0]
    }

    private async loadArticleDocById(id: string): Promise<any> {
        const articles = await this.firestore
            .collection('articles')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get()
        if(articles.docs.length == 0) {
            return null
        }
        return articles.docs[0]
    }

    public async loadAllArticles(lastDisplayedArticleId?: string, articleFilter?: ArticleFilter): Promise<Article[]> {
        let query = this.firestore
            .collection('articles')
            .orderBy("createDate", 'desc')
        query = ArticlesService.addFilterToQuery(query, articleFilter)

        if(lastDisplayedArticleId) {
            const lastDisplayedArticle = await this.loadArticleDocById(lastDisplayedArticleId)
            query = query.startAfter(lastDisplayedArticle)
        }

        const articles = await query
            .limit(PAGE_SIZE)
            .get()
        return this.addRegionNameToArticles(articles.docs.map(article => this.articleDataToArticle(article)) as Article[])
    }

    private static addFilterToQuery(query: FirebaseFirestore.Query, articleFilter?: ArticleFilter): FirebaseFirestore.Query {
        if(!articleFilter){
            return query
        }

        let result = query
        if(articleFilter.sex) {
            result = result.where('isMale', '==', articleFilter.sex == 'male')
        }
        if(articleFilter.breedId && articleFilter.breedId > 0) {
            result = result.where('breedId', '==', articleFilter.breedId)
        }
        if(articleFilter.regionId && articleFilter.regionId > 0) {
            result = result.where('regionId', '==', articleFilter.regionId)
        }
        if(articleFilter.userId) {
            result = result.where('userId', '==', articleFilter.userId)
        }
        
        return result
    }

    private async addRegionNameToArticles(articles: Article[]): Promise<Article[]> {
        const regions = await this.regionsService.loadAllRegions()
        const result = articles.map(article => {return {...article, regionName: this.findRegion(article.regionId, regions).regionName}})
        return result
    }

    private findRegion(regionId: number, regions: Region[]): Region {
        return regions.find(reg => reg.regionId == regionId)
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
            regionId: +articleInput.regionId,
            imageId: articleInput.imageId,
            articleText: articleInput.articleText,
            createDate: dateNow,
            breedId: +articleInput.breedId,
            breedName: breed.breedName,
            userId: user.uid,
            userName: user.displayName,
            userPhotoUrl: user.photoURL
        }
        console.log(docData)
        const docRef = await this.firestore
            .collection('articles')
            .add(docData)
        return (await this.addRegionNameToArticles([{
            ...docData,
            _id: docRef.id,
            createDate: new Date(dateNow),
            regionName: "unknown"
        }]))[0]
    }

    public async deleteArticle(articleId: string, userToken: string): Promise<Article> {
        const article = await this.loadArticleById(articleId)
        const user = await this.userService.resolveUser(userToken)
        if(article.userId != user.uid) {
            console.log("access denied")
            throw new Error("Access denied - users can only delete articles they created")
        }

        const result: FieldValue = await this.firestore.collection('articles').doc(articleId).delete()
        return article
    }

    public async renewArticle(articleId: string, userToken: string): Promise<Article> {
        const articleDoc = await this.loadArticleDocById(articleId)
        const user = await this.userService.resolveUser(userToken)
        if(articleDoc.data().userId != user.uid) {
            throw new Error(`Access denied - only author can renew article`)
        }

        const dateNow = Date.now()
        await articleDoc.ref.update({createDate: new Date(dateNow)})
        const article = await this.articleDocToArticle(articleDoc)
        article.createDate = new Date(dateNow)
        return article
    }
}