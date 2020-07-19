import * as Yup from 'yup';
import api from './ApiService';

/**
 * Class to manage and process requests to repositories
 * @class RepositoryService
 */
class RepositoryService {
  /**
   * Function to fetch and return a list of repositories from a given username
   * @async
   * @param {{username}} body Body of the request
   * @param {{page, per_page}} query Query params for pagination
   * @returns A array of repositories
   * @memberof RepositoryService
   */
  async searchRepos(body = {}, query = {}) {
    // Validation structure of body component
    const schemaBody = Yup.object().shape({
      username: Yup.string().required(),
    });

    // Validation structure of query params to paginate
    const schemaQuery = Yup.object().shape({
      page: Yup.number().positive(),
      per_page: Yup.number().positive(),
    });

    if (!(await schemaBody.isValid(body))) {
      return {
        status: 400,
        body: { error: 'Username required. The field username was not found.' },
      };
    }

    if (!(await schemaQuery.isValid(query))) {
      return {
        status: 400,
        body: { error: 'Params structure failed. Verify your params.' },
      };
    }

    const { page = 1, per_page = 5 } = query;
    const { username } = body;

    try {
      // Fetching data from Github api
      const repos = await api.get(`/users/${username}/repos`);

      // Calculates the first and last index from the array of repos result
      const baseIndex = (Math.abs(page) - 1) * Math.abs(per_page);
      const lastIndex = Math.abs(page) * Math.abs(per_page);

      if (repos.data.length !== 0) {
        return {
          status: 200,
          body: {
            repos: repos.data.slice(baseIndex, lastIndex),
            totalpages: Math.ceil(repos.data.length / per_page),
          },
        };
      }
      return {
        status: 200,
        body: [],
      };
    } catch (error) {
      // If user was not found
      if (error.response.status === 404) {
        return {
          status: 404,
          body: { error: 'User not found' },
        };
      }

      // If some error occurs that's not a 404
      return {
        status: error.response.status,
        body: { error: error.response.data.message },
      };
    }
  }

  /**
   * Function to get details of a given repository name
   * @async
   * @param {{reponame}} query
   * @returns A JSON encoded repository details
   * @memberof RepositoryService
   */
  async detailRepo(query = {}) {
    // Validation of schema for reponame
    const schema = Yup.object().shape({
      reponame: Yup.string().required(),
    });

    if (!(await schema.isValid(query))) {
      return {
        status: 400,
        body: { error: 'Validation failed. The param Reponame is required' },
      };
    }

    const { reponame } = query;

    try {
      // Fetching repository data from Github api
      const repoDetail = await api.get(`/repos/${reponame}`);

      return {
        status: 200,
        body: repoDetail.data,
      };
    } catch (error) {
      // Error if the repository was not found
      if (error.response.status === 404) {
        return {
          status: 404,
          body: { error: 'Repository not found' },
        };
      }

      // If some error that is not a 404
      return {
        status: error.response.status,
        body: { error: error.response.data.message },
      };
    }
  }
}

export default new RepositoryService();
