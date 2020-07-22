import MockAdapter from 'axios-mock-adapter';
import api from '../src/app/services/ApiService';
import RepositoryService from '../src/app/services/RepositoryService';

describe('Executing tests for repository service', () => {
  let instance;
  let mock;

  beforeEach(() => {
    instance = api;
    mock = new MockAdapter(instance);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('Executing tests for searchRepos method', () => {
    it('Should return an error if the username was not given', async () => {
      const response = await RepositoryService.searchRepos({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return error if page is not a number', async () => {
      const response = await RepositoryService.searchRepos(
        { username: 'fakeuser' },
        { page: 'a' }
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return error if user was not found on Github', async () => {
      mock.onGet(/\/users\/\w+\/repos/).reply(404, {});

      const response = await RepositoryService.searchRepos({
        username: 'anyusername',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return error if something happens at the request', async () => {
      mock.onGet(/\/users\/\w+\/repos/).reply(500, {});

      const response = await RepositoryService.searchRepos({
        username: 'anyusername',
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return success and fetch the results', async () => {
      mock.onGet(/\/users\/\w+\/repos/).reply(200, [{ name: 'repotest' }]);

      const response = await RepositoryService.searchRepos({
        username: 'anyusername',
      });

      expect(response.status).toBe(200);
      expect(response.body.repos).toBeArray();
    });
  });

  describe('Executing tests for detail method', () => {
    it('Should return error if the reponame was not given', async () => {
      const response = await RepositoryService.detailRepo({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return error if repository was not found on Github', async () => {
      mock.onGet(/\/repos\/\w+/).reply(404, {});

      const response = await RepositoryService.detailRepo({
        reponame: 'anyreponame',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return error if something wrong happens with the request', async () => {
      mock.onGet(/\/repos\/\w+/).reply(500, {});

      const response = await RepositoryService.detailRepo({
        reponame: 'anyreponame',
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return success and fetch the result', async () => {
      mock.onGet(/\/repos\/\w+/).reply(200, { data: [] });

      const response = await RepositoryService.detailRepo({
        reponame: 'anyreponame',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeArray();
    });
  });
});
