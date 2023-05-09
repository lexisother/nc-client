import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';
import { useIdb } from '../storage';
import Spinner from './util/Spinner';
import Slide from './Slide';
import { Autoplay, Swiper as ISwiper } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';

const GET_SLIDES = gql(`
  query GetSlides($slug: [String]) {
    narrowcastingEntries(slug: $slug) {
      ... on narrowcasting_slides_Entry {
        id
        slug
        enabled
        autoplay
        autoplaySpeed
        narrowcastingSlides {
          ... on narrowcastingSlides_textMedia_BlockType {
            enabled
            text
            textColour
            backgroundColour
            autoplaySpeed
            media {
              id
              url
              width
              kind
            }
          }
          ... on narrowcastingSlides_media_BlockType {
            enabled
            autoplaySpeed
            media {
              id
              url
              width
              kind
            }
          }
          ... on narrowcastingSlides_text_BlockType {
            enabled
            text
            textColour
            backgroundColour
            autoplaySpeed
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
  const [_lastViewed, setLastViewed] = useIdb('lastViewed', null);

  // We disrupt this broadcast with some LONG SETUP {{{
  // Alright, so, don't even ask. This entire thing is a huge hack based off my
  // original implementation in the backend repository, which was previously
  // used as a frontend as well:
  // https://github.com/lexisother/craft-narrowcasting/blob/9ca0d13279ccdada2a10d9b6d52a8ed5f2ccd426/web/js/nc/index.js#L17-L27
  // The reason it's such a hack is because, personally, I heavily insist on
  // doing things as "Reacty" as possible. Could that potentially turn into
  // horrible shitcode? Yes. Does it assert things work as expected? Maybe.
  const [handlers, setHandlers] = React.useState<Record<string, () => void>>();
  const handlersRef = useRef<Record<string, () => void>>();
  const [swiper, setSwiper] = React.useState<ISwiper>();

  React.useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  React.useEffect(() => {
    if (!swiper) return undefined;
    let ArrowLeft = (): void => swiper.slidePrev();
    let ArrowRight = (): void => swiper.slideNext();
    setHandlers({ ArrowLeft, ArrowRight });

    const listener = (e: KeyboardEvent): void => {
      if (!handlersRef.current) return;
      const k = e.key;
      // This notation stops ESLint from complaining about `no-prototype-builtins`.
      if (Object.prototype.hasOwnProperty.call(handlersRef.current, k)) {
        handlersRef.current[k]();
      }
    };
    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [swiper, handlersRef]);
  // }}}
  // Resuming regular programme....

  // This simply stores the slug of the cast we're viewing into IDB, so the
  // selector can access it. When the selector loads, it checks if this value
  // exists, and if so, immediately load that cast.
  React.useEffect(() => {
    setLastViewed(slug);
  }, [slug, setLastViewed]);

  if (loading) return <Spinner />;
  if (error) throw new Error(error.message);

  // TODO: Any better way to do this? I *need* to do the type assertions so TS
  // doesn't complain.
  let meta = data?.narrowcastingEntries?.[0];
  let autoplaySpeed = meta?.autoplaySpeed && meta?.autoplaySpeed * 1000;
  let slides = data?.narrowcastingEntries?.[0]?.narrowcastingSlides;
  return (
    <Swiper
      modules={[Autoplay]}
      direction="horizontal"
      loop={true}
      autoplay={meta?.autoplay === true ? { delay: autoplaySpeed ?? 3000 } : false}
      onSwiper={setSwiper}>
      {slides?.map((s, i) => {
        autoplaySpeed = s?.autoplaySpeed * 1000;
        switch (s?.__typename) {
          case SLIDE_TYPES.TEXT: {
            return (
              <SwiperSlide
                key={i}
                // Doesn't exist in the intellisense (sadly)
                data-swiper-autoplay={meta?.autoplay === true ? autoplaySpeed : false}>
                <Slide
                  type={s.__typename}
                  text={s.text!}
                  textColour={s.textColour!}
                  backgroundColour={s.backgroundColour!}
                />
              </SwiperSlide>
            );
          }
          case SLIDE_TYPES.MEDIA: {
            return (
              <SwiperSlide key={i}>
                <Slide type={s.__typename} media={s.media[0]!} />
              </SwiperSlide>
            );
          }
          case SLIDE_TYPES.TEXTMEDIA: {
            return (
              <SwiperSlide key={i}>
                <Slide
                  type={s.__typename}
                  text={s.text!}
                  textColour={s.textColour!}
                  backgroundColour={s.backgroundColour!}
                  media={s.media[0]!}
                />
              </SwiperSlide>
            );
          }
          default:
            return null;
        }
      })}
    </Swiper>
  );
}
