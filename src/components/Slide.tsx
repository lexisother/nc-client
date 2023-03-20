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
    <div className="slide" style={{ backgroundColor: backgroundColour }}>
      <div className="spacer-vert"></div>
      <div className="inner">
        <div className="spacer-hor"></div>
        <div className="text-content" style={{ color: textColour }}>
          {text} (type: {type}) ({mediaUrl})
        </div>
      </div>
      <div className="spacer-vert"></div>
    </div>
  );
}
