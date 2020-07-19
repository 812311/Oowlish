import RepositoryService from '../services/RepositoryService';

/**
 * Controller for repositories
 * @class RepositoryController
 */
class RepositoryController {
  /**
   * Function to search github repositories by user
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @returns JSON with data
   * @memberof RepositoryController
   */
  async search(req, res) {
    const service = await RepositoryService.searchRepos(req.body, req.query);
    return res.status(service.status).json(service.body);
  }

  /**
   * Function to get details of a github repository by name
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @returns JSON with data
   * @memberof RepositoryController
   */
  async detail(req, res) {
    const service = await RepositoryService.detailRepo(req.query);
    return res.status(service.status).json(service.body);
  }
}

export default new RepositoryController();
