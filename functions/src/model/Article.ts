export interface ArticleCommon {
    breedId: number
    petName: string
    petAge: number
    isMale: boolean
    regionId: number
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
    regionName: string
    userPhotoUrl: string
    likedBy: string[]
}
export const articleFields = `
    _id: ID!
    breedName: String
    breedId: Int!
    petName: String!
    petAge: Int
    isMale: Boolean
    regionId: ID!
    regionName: String
    createDate: Date
    imageId: ID!
    articleText: String
    userId: String!
    userName: String
    userPhotoUrl: String
    likedBy: [String]
`
export const articleTypeDef = `
type Article {
    ${articleFields}
}

input ArticleInput {
    breedId: Int!
    petName: String!
    petAge: Int
    isMale: Boolean
    imageId: ID!
    regionId: ID!
    articleText: String
    userToken: String!
}
`