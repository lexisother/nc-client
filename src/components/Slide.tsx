import styles from './slides/styles.module.scss';

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
      <div className={styles.spacerVert}></div>
      <div className={styles.inner}>
        <div className={styles.spacerHor}></div>
        <div className={styles.textContent} style={{ color: textColour }}>
          {text} {/*(type: {type}) ({mediaUrl})*/}
        </div>
      </div>
      <div className={styles.spacerVert}></div>
    </div>
  );
}
