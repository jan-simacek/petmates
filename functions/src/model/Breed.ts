export interface Breed {
    _id: string
    breedId: number
    breedName: string
}

export const breedTypeDef = `
type Breed {
    _id: ID!
    breedId: ID!
    breedName: String!
}
`