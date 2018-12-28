export interface BreedsResponse {
    breeds: Array<Breed>
}

export interface Breed {
    breedId: number
    breedName: string
}