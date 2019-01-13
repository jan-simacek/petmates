import { Region } from "../../model";
import { Query } from "react-apollo";
import gql from "graphql-tag";

interface RegionsResponse {
    regions: Region[]
}

export class RegionsQuery extends Query<RegionsResponse> {}

export const REGIONS_QUERY = gql`
    {
        regions {
            regionId
            regionName
        }
    }
`