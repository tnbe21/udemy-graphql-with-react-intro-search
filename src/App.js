import React, { Component } from 'react';
import {
  ApolloProvider,
  useQuery,
  useMutation,
} from '@apollo/client';
import client from './client';
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from './graphql';

const PER_PAGE = 5;
const DEFAULT_STATE = {
  after: null,
  before: null,
  first: PER_PAGE,
  last: null,
  query: 'フロントエンドエンジニア',
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

  goPrevious(search) {
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
    });
  }

  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
    });
  }

  render() {
    const StarButton = (props) => {
      const { node, after, before, first, last, query } = props;
      const totalCount = node.stargazers.totalCount;
      const viewerHasStarred = node.viewerHasStarred;
      const starCount = totalCount === 1 ? '1 star' : `${totalCount} stars`;

      const [addOrRemoveStar, { loading, error }] = useMutation(viewerHasStarred ? REMOVE_STAR : ADD_STAR, {
        refetchQueries: mutationResult => {
          console.log({ mutationResult });
          return [
            {
              query: SEARCH_REPOSITORIES,
              variables: { after, before, first, last, query },
            },
          ];
        },
      });
      if (loading) {
        return 'Loading...';
      }
      if (error) {
        return `Error! ${error.message}`;
      }

      return (
        <button onClick={() => {
          addOrRemoveStar({
            variables: {
              input: {
                starrableId: node.id,
              },
            },
          });
        }}>
          {starCount} | {viewerHasStarred ? 'starred' : '-'}
        </button>
      );
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

      const search = data.search;
      const repositoryCount = search.repositoryCount;
      const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
      const title = `Github Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;
      console.log(search.edges);
      return (
        <React.Fragment>
          <h2>{title}</h2>
          <ul>
            {
              search.edges.map(edge => {
                const node = edge.node;
                return (
                  <li key={node.id}>
                    <a href={node.url} rel='noreferrer' target='_blank'>{node.name}</a>
                    &nbsp;
                    <StarButton {...{ node, after, before, first, last, query }} />
                  </li>
                )
              })
            }
          </ul>

          {
            search.pageInfo.hasPreviousPage === true ?
              <button
                onClick={this.goPrevious.bind(this, search)}
              >
                Previous
              </button>
              :
              null
          }
          {
            search.pageInfo.hasNextPage === true ?
              <button
                onClick={this.goNext.bind(this, search)}
              >
                Next
              </button>
              :
              null
          }
        </React.Fragment>
      );
    };

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
