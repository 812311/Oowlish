import React, { Component } from 'react';
import { FaGithubAlt, FaSearch, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import api from '../../services/api';
import { Form, SubmitButton, List } from './styles';
import { Container } from '../../components/Container';
import { Error } from '../../components/Error';
import Logo from '../../assets/images/logo.png';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      user: '',
      repositories: [],
      pageNumber: 1,
      load: false,
      error: '',
      countPages: '',
    };
  }

  /**
   * This will check if there are any user with repositories
   * already saved on local storage from previous search.
   * */
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    const pageNumber = localStorage.getItem('pageNumber');
    const countPages = localStorage.getItem('countPages');
    const user = localStorage.getItem('user');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
      this.setState({ pageNumber: JSON.parse(pageNumber) });
      this.setState({ countPages: JSON.parse(countPages) });
      this.setState({ user: JSON.parse(user) });
    }
  }

  /**
   * This will compare the new user search with the current
   * users repositories displayed already saved from previous search.
   * */
  componentDidUpdate(_, prevState) {
    const {
 repositories, pageNumber, countPages, user
} = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
      localStorage.setItem('pageNumber', JSON.stringify(pageNumber));
      localStorage.setItem('countPages', JSON.stringify(countPages));
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * This function captures every key typed before the submit
   * and it will save on the state newUser.
   * */
  handleInputChange = (e) => {
    this.setState({ newUser: e.target.value });
    e.target.value && this.setState({ user: e.target.value });
  };

  /**
   * It will handle the submit buttom to search the user repositories
   * It receives a value for the pagination or will default as 1.
   * It cancels the default action to submit a form, and follows the
   * instructions after.
   *  - Setting error message to a empty string.
   *  - It will check if there is information typed on the input field.
   *  - Setting the loading status as true.
   *  - Searching through the API.
   * Case Success:
   *  - It saves the array of repositories on the state repositories
   *    with with their full name(Owner/Repo).
   *  - It sets the input newUser as empty, to be able to search
   * another user quickier.
   *  - It sets the loading state as false to enable the button
   * to run another search.
   *  - Sets the page number on a state.
   *  - Sets the number of pages of the total amount of data.
   * Case Failed:
   *  - It will checks if the error is the response
   * and gives a general message with possible cause.
   *  - It will checks if the error is the request
   * and gives a general message with possible cause.
   *  - It will gives a general error message without any specificity.
   *  - It sets the loading state as false to enable the button
   * to run another search
   * */
  handleSubmit = async (e, value = 1) => {
    e.preventDefault();
    const { user } = this.state;
    this.setState({ error: '' });

    if (user) {
      this.setState({ load: true });
      await api
        .post(
          '/search-repos',
          {
            username: user,
          },
          {
            params: {
              page: value,
            },
          },
        )
        .then((res) => {
          this.setState({
            repositories: res.data.repos,
            newUser: '',
            load: false,
            pageNumber: value,
            countPages: res.data.totalpages,
          });
        })
        .catch((err) => {
          if (err.response) {
            this.setState({ error: 'Make sure you typed the correct user.' });
          } else if (err.request) {
            this.setState({ error: 'Make sure you have internet connection.' });
          } else {
            this.setState({
              error:
                'We could not make this happen. Check for problems or try again later.',
            });
          }
          this.setState({ load: false });
        });
    } else {
      this.setState({ error: 'Enter the username.' });
    }
  };

  render() {
    /* Destructures the states of the aplication for better readbility */
    const {
      newUser,
      load,
      repositories,
      error,
      pageNumber,
      countPages,
    } = this.state;
    return (
      <Container>
        <img src={Logo} alt="oowlish" />
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search Github User"
            value={newUser}
            onChange={this.handleInputChange}
          />
          <SubmitButton load={load}>
            {load ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSearch color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        {/* Show the error message in case it fails to get the data from the API */}
        {error && <Error>{error}</Error>}
        <List>
          {/* Uses array map to list the repositories on the screen */}
          {repositories.map((repo) => (
            <li key={repo.full_name}>
              <span>{repo.full_name}</span>
              <Link to={`/repository/${encodeURIComponent(repo.full_name)}`}>
                Details
              </Link>
            </li>
          ))}
        </List>
        {countPages && (
          <Pagination
            count={countPages}
            page={pageNumber}
            onChange={this.handleSubmit}
          />
        )}
      </Container>
    );
  }
}
