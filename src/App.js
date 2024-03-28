import React, { Component } from 'react';
import {
  ApolloProvider,
  gql,
  useQuery
} from '@apollo/client';
import client from './client';

const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`;
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
