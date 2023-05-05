import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';
import Spinner from './util/Spinner';
import styles from './narrowcastselector.module.scss';
import { Link } from 'react-router-dom';
import { pluralise } from '../lib';
import { useIdb } from '../storage';
import Error from './util/Error';

const GET_CASTS = gql(`
  query GetCasts {
    narrowcastingEntries {
      ... on narrowcasting_slides_Entry {
        title
        slug
        enabled
        # This part is only really here because Craft doesn't have a built in
        # way for me to count things.
        narrowcastingSlides {
          ... on narrowcastingSlides_textMedia_BlockType {
            id
          }
          ... on narrowcastingSlides_media_BlockType {
            id
          }
          ... on narrowcastingSlides_text_BlockType {
            id
          }
        }
      }
    }
  }
`);

export default function NarrowcastSelector(): JSX.Element {
  const { loading, error, data } = useQuery(GET_CASTS);
  const [lastViewed, _setLastViewed] = useIdb('lastViewed', null);
  if (loading) return <Spinner />;
  if (error) {
    return (
      <>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flexGrow: 1 }} />
          <Error error={error} />
          <div style={{ flexGrow: 1 }} />
        </div>
        <div style={{ flexGrow: 1 }} />
      </>
    );
  }

  if (lastViewed) {
    window.location.pathname = lastViewed;
  }

  return (
    <div>
      <h1 className={styles.title}>Available casts</h1>
      <div className={styles.grid}>
        {data?.narrowcastingEntries && data.narrowcastingEntries.length >= 1 ? (
          data?.narrowcastingEntries?.map(
            (e) =>
              e?.enabled && (
                <Link to={`/${e.slug}`} className={styles.cast}>
                  <p>{e.title}</p>
                  <p>{pluralise(e.narrowcastingSlides.length, 'slide', 's', '', false)}</p>
                </Link>
              ),
          )
        ) : (
          <p>No narrowcasting entries were found.</p>
        )}
      </div>
    </div>
  );
}
