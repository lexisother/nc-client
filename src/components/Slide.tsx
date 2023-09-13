import styles from './slides/styles.module.scss';

interface SlideProps {
  type: string;
  text?: string;
  textColour?: string;
  backgroundColour?: string;
  media?: {
    // Directly stolen from the generated GraphQL typings.
    __typename?: 'narrowcasting_Asset';
    id?: string | null;
    url?: string | null;
    width?: number | null;
    kind: string;
  };
}

// Hi. Welcome to conditional hell. In the twig days, I used to simply
// `include` a different template with minor changes to each one based on the
// slide type. We have access to a much more powerful toolset now, so why not
// ~~leverage~~ abuse it?
export default function Slide({
  text,
  textColour,
  backgroundColour,
  media,
}: SlideProps): JSX.Element {
  if (text)
    return (
      <div className={styles.slide} style={{ backgroundColor: backgroundColour }}>
        <div className={styles.spacerVert}></div>
        <div className={styles.inner}>
          {media && (
            <>
              {media.kind === 'image' && (
                // <div className={styles.media} style={{ backgroundImage: `url(${media.url})` }} />
                <img className={styles.media} src={media.url!} />
              )}
              {media.kind === 'video' && <video className={styles.media} src={media.url!} />}
            </>
          )}
          <div className={styles.spacerHor}></div>
          <div
            className={styles.textContent}
            style={{ color: textColour, ...(media ? { width: '40%' } : {}) }}>
            {text}
          </div>
        </div>
        <div className={styles.spacerVert}></div>
      </div>
    );
  else if (media) {
    if (media.kind === 'image')
      return (
        <div
          className={styles.media}
          style={{ height: '100%', backgroundImage: `url(${media.url})` }}
        />
      );
    if (media.kind === 'video') return <video className={styles.media} src={media.url!} />;
    else return <h1>UNSUPPORTED MEDIA TYPE</h1>;
  } else {
    return <h1>UNSUPPORTED SLIDE TYPE.</h1>;
  }
}
