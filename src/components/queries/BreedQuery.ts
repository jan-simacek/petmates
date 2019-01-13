import { Query } from "react-apollo";
import { Breed } from "../../model";
import gql from "graphql-tag";

interface BreedsResponse {
  breeds: Array<Breed>
}
  
export class BreedQuery extends Query<BreedsResponse> {}

export const BREED_QUERY = gql`
    {
      breeds {
        breedId,
        breedName
      }
    }
`