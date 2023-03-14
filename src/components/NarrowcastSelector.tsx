import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';

const GET_CASTS = gql(`
  query GetCasts {
    narrowcastingEntries {
      ... on narrowcasting_slides_Entry {
        slug
      }
    }
  }
`);

export default function NarrowcastSelector(): JSX.Element {
  const { loading, error, data } = useQuery(GET_CASTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      {data?.narrowcastingEntries?.map((e) => (
        <p>{e?.slug}</p>
      ))}
    </div>
  );
}
