import * as admin from 'firebase-admin'
import { Region } from '../model/Region';

export class RegionsService {
    public async loadAllRegions(): Promise<Region[]> {
        let regions = await admin
            .firestore()
            .collection('regions')
            .orderBy('regionId')
            .get()
        return regions.docs.map(region => region.data()) as Region[]
    }
}