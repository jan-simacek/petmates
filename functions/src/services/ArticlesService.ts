import * as admin from 'firebase-admin'
import { Article, ArticleInput, Region } from '../model';
import { BreedsService } from './BreedsService';
import { UserService } from './UserService';
import { RegionsService } from './RegionsService';

const PAGE_SIZE = 3

interface ArticleFilter {
    sex?: string
    breedId?: number
}

export class ArticlesService {
    constructor(private breedsService: BreedsService, private userService: UserService, private regionsService: RegionsService){}

    public async loadArticleById(articleId: string): Promise<Article> {
        const article = await this.loadArticleDocById(articleId)
        const result = (await this.addRegionNameToArticles([this.articleDataToArticle(article)]))[0]
        return result
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

    public async loadAllArticles(lastDisplayedArticleId?: string, articleFilter?: ArticleFilter): Promise<Article[]> {
        let query = admin
            .firestore()
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
        if(articleFilter.breedId) {
            result = result.where('breedId', '==', articleFilter.breedId)
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
        console.log(articleInput)
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
        const docRef = await admin
            .firestore()
            .collection('articles')
            .add(docData)
        return (await this.addRegionNameToArticles([{
            ...docData,
            _id: docRef.id,
            createDate: new Date(dateNow),
            regionName: "unknown"
        }]))[0]
    }
}