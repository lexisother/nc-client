import { useQuery } from '@apollo/client';
import './App.scss';
import { gql } from './__generated__/gql';

const GET_SLIDES = gql(`
  query GetSlides {
    narrowcastingEntries {
      ... on narrowcasting_slides_Entry {
        id
        narrowcastingSlides {
          ... on narrowcastingSlides_textMedia_BlockType {
            text
            textColour
            backgroundColour
            enabled
          }
          ... on narrowcastingSlides_media_BlockType {
            enabled
            media {
              id
              url
              width
            }
          }
          ... on narrowcastingSlides_text_BlockType {
            text
            textColour
            backgroundColour
            enabled
          }
        }
      }
    }
  }
`);

export default function App(): JSX.Element {
  const { loading, error, data } = useQuery(GET_SLIDES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return <div className="app-container"></div>;
}
