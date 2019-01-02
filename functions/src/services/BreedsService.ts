import * as admin from 'firebase-admin'
import { Breed } from '../model';

export class BreedsService {
    public async loadAllBreeds() {
        const breeds = await admin
                .firestore()
                .collection('breeds')
                .get()
        return breeds.docs.map(breed => breed.data()) as Breed[]
    }
}