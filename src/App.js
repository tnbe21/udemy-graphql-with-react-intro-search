import React, { Component } from 'react';
import {
  ApolloProvider,
  useQuery
} from '@apollo/client';
import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
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
  console.log(data.search);
  const repositoryCount = data.search.repositoryCount;
  const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
  const title = `Github Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;
  return <h2>{title}</h2>
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;

    // handleChange/handleSubmitのthisの参照先を、クラスインスタンスに束縛する
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { query } = this.state;
    console.log({ query });

    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.handleSubmit}>
          <input value={query} onChange={this.handleChange} />
        </form>
        <Query state={this.state} />
      </ApolloProvider>
    );
  }
}

export default App;
