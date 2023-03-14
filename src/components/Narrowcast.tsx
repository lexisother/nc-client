import { useParams } from 'react-router-dom';
import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';

const GET_CASTS = gql(`
  query GetCasts($slug: [String]) {
    narrowcastingEntries(slug: $slug) {
      ... on narrowcasting_slides_Entry {
        slug
      }
    }
  }
`);

export default function Narrowcast(): JSX.Element {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(GET_CASTS, { variables: { slug } });
  console.log(data);
  return <p>{slug}</p>;
}
