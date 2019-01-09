export interface Article extends ArticleCommon {
    _id: string
    createDate: Date
    breedName: String
    userId: string
    userName: string
    userPhotoUrl: string
}

export interface ArticleInput extends ArticleCommon{
    userToken: string
}

export interface ArticleCommon {
    breedId: number
    petName: string
    petAge: number
    isMale: boolean
    imageId: string
    articleText: string
}

export interface ArticleListResponse {
    articles: Article[]
}