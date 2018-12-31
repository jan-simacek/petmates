export interface Article extends ArticleInput {
    _id: number
    createDate: Date
}

export interface ArticleInput {
    breedId: number
    petName: string
    petAge: number
    isMale: boolean
    imageId: string
}

export interface ArticleListResponse {
    articles: Article[]
}