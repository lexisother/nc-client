import React from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';
import Spinner from './util/Spinner';
import Slide from './Slide';
import { Swiper as ISwiper } from 'swiper';
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
              kind
            }
            enabled
          }
          ... on narrowcastingSlides_media_BlockType {
            enabled
            media {
              id
              url
              width
              kind
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

  // We disrupt this broadcast with some LONG SETUP {{{
  const [handlers, setHandlers] = React.useState<Record<string, () => void>>();
  const [swiper, setSwiper] = React.useState<ISwiper>();

  const listener = (e: KeyboardEvent): void => {
    if (!handlers) return;
    const k = e.key;
    // This notation stops ESLint from complaining about `no-prototype-builtins`.
    if (Object.prototype.hasOwnProperty.call(handlers, k)) {
      handlers[k]();
    }
  };

  React.useEffect(() => {
    if (!swiper) return undefined;
    let ArrowLeft = (): void => swiper.slidePrev();
    let ArrowRight = (): void => swiper.slideNext();
    setHandlers({ ArrowLeft, ArrowRight });
    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [swiper, handlers]);
  // }}}
  // Resuming regular programme....

  if (loading) return <Spinner />;
  if (error) throw new Error(error.message);

  // TODO: Any better way to do this? I *need* to do the type assertions so TS
  // doesn't complain.
  let slides = data?.narrowcastingEntries?.[0]?.narrowcastingSlides;
  return (
    <Swiper direction="horizontal" loop={true} onSwiper={setSwiper}>
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
              <Slide type={s.__typename} media={s.media[0]!} />
            </SwiperSlide>
          )}
          {s?.__typename === SLIDE_TYPES.TEXTMEDIA && (
            <SwiperSlide>
              <Slide
                type={s.__typename}
                text={s.text!}
                textColour={s.textColour!}
                backgroundColour={s.backgroundColour!}
                media={s.media[0]!}
              />
            </SwiperSlide>
          )}
        </>
      ))}
    </Swiper>
  );
}
