export interface Region {
    regionId: number
    regionName: string
}

export const regionTypeDef = `
type Region {
    regionId: ID!
    regionName: String!
}
`