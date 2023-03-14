import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css/normalize.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://craft-ddev.ddev.site/index.php?p=admin/actions/graphql/api',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
