export interface ArticleInput {
    breedId: string
    petName: string
    petAge: number
    isMale: boolean
    imageId: string
    articleText: string
}

export interface Article extends ArticleInput {
    _id: string
    createDate: Date
    breedName: string
}

export const articleTypeDef = `
type Article {
    _id: ID!
    breedName: String
    breedId: ID!
    petName: String!
    petAge: Int
    isMale: Boolean
    createDate: Date
    imageId: ID!
    articleText: String
}

input ArticleInput {
    breedId: ID!
    petName: String!
    petAge: Int
    isMale: Boolean    
    imageId: ID!
    articleText: String
}
`