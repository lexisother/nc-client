import { useParams } from 'react-router-dom';
import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';
import Spinner from './util/Spinner';
import Slide from './Slide';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

const GET_SLIDES = gql(`
  query GetSlides($slug: [String]) {
    narrowcastingEntries(slug: $slug) {
      ... on narrowcasting_slides_Entry {
        id
        slug
        enabled
        narrowcastingSlides {
          ... on narrowcastingSlides_textMedia_BlockType {
            text
            textColour
            backgroundColour
            media {
              id
              url
              width
            }
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

export enum SLIDE_TYPES {
  TEXT = 'narrowcastingSlides_text_BlockType',
  MEDIA = 'narrowcastingSlides_media_BlockType',
  TEXTMEDIA = 'narrowcastingSlides_textMedia_BlockType',
}

export default function Narrowcast(): JSX.Element {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(GET_SLIDES, { variables: { slug } });
  if (loading) return <Spinner />;
  if (error) throw new Error(error.message);

  // TODO: Any better way to do this? I *need* to do the type assertions so TS
  // doesn't complain.
  let slides = data?.narrowcastingEntries?.[0]?.narrowcastingSlides;
  return (
    <Swiper direction="horizontal" loop={true}>
      {slides?.map((s) => (
        <>
          {s?.__typename === SLIDE_TYPES.TEXT && (
            <SwiperSlide>
              <Slide
                type={s.__typename}
                text={s.text!}
                textColour={s.textColour!}
                backgroundColour={s.backgroundColour!}
              />
            </SwiperSlide>
          )}
          {s?.__typename === SLIDE_TYPES.MEDIA && (
            <SwiperSlide>
              <Slide
                type={s.__typename}
                mediaUrl={s.media[0]?.url!}
                mediaWidth={s.media[0]?.width!}
              />
            </SwiperSlide>
          )}
          {s?.__typename === SLIDE_TYPES.TEXTMEDIA && (
            <SwiperSlide>
              <Slide
                type={s.__typename}
                text={s.text!}
                textColour={s.textColour!}
                backgroundColour={s.backgroundColour!}
                mediaUrl={s.media[0]?.url!}
                mediaWidth={s.media[0]?.width!}
              />
            </SwiperSlide>
          )}
        </>
      ))}
    </Swiper>
  );
}
