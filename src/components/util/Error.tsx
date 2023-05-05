import { ApolloError } from '@apollo/client';
import styles from './error.module.scss';
import StackTracey from 'stacktracey';

interface ErrorProps {
  error: ApolloError;
}

export default function Error({ error }: ErrorProps): JSX.Element {
  const stack = new StackTracey(error).withSources().clean();

  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <section>
        <details title="More info">
          <pre>
            {error.message}
            {'\n'} {/* :harold: */}
            {stack.asTable()}
          </pre>
        </details>
      </section>
    </div>
  );
}
