import React, { Component } from 'react';
import {
  ApolloProvider,
  useQuery
} from '@apollo/client';
import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: 'フロントエンドエンジニア',
};

const Query = (props) => {
  const { after, before, first, last, query } = props.state;
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: { after, before, first, last, query },
  });
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  console.log({ data });
  return <div></div>
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = VARIABLES;
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Query state={this.state} />
      </ApolloProvider>
    )
  }
}

export default App;
