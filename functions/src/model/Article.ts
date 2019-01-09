export interface ArticleCommon {
    breedId: string
    petName: string
    petAge: number
    isMale: boolean
    imageId: string
    articleText: string
}

export interface ArticleInput extends ArticleCommon{
    userToken: string
}

export interface Article extends ArticleCommon {
    _id: string
    createDate: Date
    breedName: string
    userId: string
    userName: string
    userPhotoUrl: string
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
    userId: String!
    userName: String
    userPhotoUrl: String
}

input ArticleInput {
    breedId: ID!
    petName: String!
    petAge: Int
    isMale: Boolean    
    imageId: ID!
    articleText: String
    userToken: String!
}
`