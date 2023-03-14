import style from './spinner.module.scss';

interface SpinnerProps {
  balls?: boolean;
}

export default function Spinner({ balls }: SpinnerProps): JSX.Element {
  if (balls) {
    return (
      <div className={style.balls}>
        <div className={style.ball} />
        <div className={style.ball} />
        <div className={style.ball} />
      </div>
    );
  }

  return <div className={style.container} />;
}
