export interface ArticleInput {
    breedId: string
    petName: string
    age: number
    isMale: boolean
    imageId: string
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
    age: Int
    isMale: Boolean
    createDate: Date
    imageId: ID!
}

input ArticleInput {
    breedId: ID!
    petName: String!
    age: Int
    isMale: Boolean    
    imageId: ID!
}
`