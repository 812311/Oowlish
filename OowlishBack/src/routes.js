import { Router } from 'express';

import RepositoryController from './app/controllers/RepositoryController';

const routes = new Router();

routes.post('/search-repos', RepositoryController.search);
routes.get('/detail-repo', RepositoryController.detail);

export default routes;
