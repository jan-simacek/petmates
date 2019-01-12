import { Query } from "react-apollo";
import { BreedsResponse } from "../../model";
import gql from "graphql-tag";

export class BreedQuery extends Query<BreedsResponse> {}

export const BREED_QUERY = gql`
    {
      breeds {
        breedId,
        breedName
      }
    }
`