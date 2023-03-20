// TODO: Just use one damn stylesheet.
// TODO: Stop using array indexing for selecting classnames.
import styles from './slides/styles.module.scss';
import stylesText from './slides/text.module.scss';
import stylesTextMedia from './slides/textmedia.module.scss';

interface SlideProps {
  type: string;
  text?: string;
  textColour?: string;
  backgroundColour?: string;
  mediaUrl?: string;
  mediaWidth?: number;
}
export default function Slide({
  type,
  text,
  textColour,
  backgroundColour,
  mediaUrl,
  mediaWidth,
}: SlideProps): JSX.Element {
  return (
    <div className={styles.slide} style={{ backgroundColor: backgroundColour }}>
      <div className={styles['spacer-vert']}></div>
      <div className={stylesText.inner}>
        <div className={styles['spacer-hor']}></div>
        <div className={stylesText['text-content']} style={{ color: textColour }}>
          {text} {/*(type: {type}) ({mediaUrl})*/}
        </div>
      </div>
      <div className={styles['spacer-vert']}></div>
    </div>
  );
}
