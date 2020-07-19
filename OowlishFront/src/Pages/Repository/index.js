import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loading, Owner, OpenRepository } from './styles';
import { Container } from '../../components/Container';
import { Error } from '../../components/Error';

export default class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: {},
      load: true,
      error: '',
    };
  }

  /**
   * When the component mounts:
   * It receives the through props all the the information from the object selected.
   * It looks for the repository full name(owner/repo) as a parameter on the URL
   * Searchs for the repository data using the API.
   * * Case Success:
   *  - It saves the data of the repository on the state repository
   *  - It sets the loading state as false
   * Case Failed:
   *  - It will checks if the error is the response
   * and gives a general message with possible cause.
   *  - It will checks if the error is the request
   * and gives a general message with possible cause.
   *  - It will gives a general error message without any specificity.
   */
  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    await api
      .get('/detail-repo', {
        params: {
          reponame: repoName,
        },
      })
      .then((res) => {
        this.setState({
          repository: res.data,
          load: false,
        });
      })
      .catch((err) => {
        if (err.response) {
          this.setState({
            error: 'Make sure you searched the correct repository.',
          });
        } else if (err.request) {
          this.setState({ error: 'Make sure you have internet connection.' });
        } else {
          this.setState({
            error:
              'We could not make this happen. Check for problems or try again later.',
          });
        }
      });
  }

  /**
   * It renders the Loading screen when the status of load state is true.
   * If the aplication does not get the data from the API it shows and error message.
   * If the return from the API is success, it renders all the information on the screen.
   */
  render() {
    const { repository, load, error } = this.state;
    if (load) {
      return (
        <Container>
          <Link to="/">Return to list</Link>
          <OpenRepository>
            <Loading>
              <span>Loading...</span>
              {error && <Error>{error}</Error>}
            </Loading>
          </OpenRepository>
        </Container>
      );
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Return to list</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <OpenRepository>
          <a href={repository.html_url}>Open Repository</a>
        </OpenRepository>
      </Container>
    );
  }
}
Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
