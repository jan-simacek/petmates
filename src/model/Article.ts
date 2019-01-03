export interface Article extends ArticleInput {
    _id: number
    createDate: Date
    breedName: String
}

export interface ArticleInput {
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