import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { Article, Message } from "../model";
import ApolloClient from "apollo-client";
import { MESSAGES_QUERY } from "./MessageService";
import { UserService } from ".";

export class GraphQLCacheService {
    constructor(private cache: InMemoryCache, 
        private apolloClient: ApolloClient<NormalizedCacheObject>,
        private userService: UserService) {}
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

    public async updateMessagesCache(conversationId: string, messages: Message[]) {
        const userToken = this.userService.getCurrentUserToken()
        this.apolloClient
        this.apolloClient.writeQuery({
            query: MESSAGES_QUERY,
            variables: {
                conversationId,
                userToken,
                lastDisplayedId: undefined
            },
            data: messages
        })
    }
}