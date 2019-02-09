import { InMemoryCache } from "apollo-cache-inmemory";
import { Article } from "../model";

export class GraphQLCacheService {
    constructor(private cache: InMemoryCache) {}
    /**
     * hack to remove the article from all queries
     * @param articleId 
     */
    public removeArticleFromCache(articleId: string) {
        this.removeItemFromCache(this.computeArticleCacheId(articleId))
    }
    private removeItemFromCache(cacheObjectId: string) {
        const cache = this.cache as any

        // delete the Article object
        Object.keys(cache.data.data).forEach(key => {
            if(key === cacheObjectId) {
                cache.data.delete(key)
            }
        })

        // delete the object from queries
        Object.keys(cache.data.data.ROOT_QUERY).forEach(key => {
            cache.data.data.ROOT_QUERY[key].forEach((queryObject: any, index: number, array: Array<any>) => {
                if(queryObject.id === cacheObjectId) {
                    array.splice(index, 1)
                }
            })
        })
    }

    private computeArticleCacheId(articleId: string) {
        return  `Article:${articleId}`
    }

    public renewArticleInCache(article: Article) {
        const cache = this.cache as any
        const cacheObjectId = this.computeArticleCacheId(article._id)

        // replace the ArticleObject with the new one
        Object.keys(cache.data.data).forEach(key => {
            if(key === cacheObjectId) {
                cache.data.data[key] = article
                return
            }
        })
    }

    public removeConversationFromCache(conversationId: string) {
        this.removeItemFromCache(this.computeConversationCacheId(conversationId))
    }
    
    private computeConversationCacheId(conversationId: string) {
        return `Conversation:${conversationId}`
    }
}