import React, { Component } from 'react';
import {
  ApolloProvider,
  useQuery
} from '@apollo/client';
import client from './client';
import { ME } from './graphql';

const Query = () => {
  const { loading, error, data } = useQuery(ME);
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  return <div>{data.user.name}</div>
};

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>Hello, GraphQL</div>
        <Query />
      </ApolloProvider>
    )
  }
}

export default App;
