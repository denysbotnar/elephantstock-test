import * as path from 'path';
import { Request, Response, Router } from 'express';
import { UserController } from '../controllers/api';

export function apiRoutes(router: Router): Router {
  const userController = new UserController();
  router.get('/users', userController.all);
  router.post('/users', userController.store);
  router.put('/users/:id', userController.updateById);
  router.delete('/users/:id', userController.destroyById);

  return router;
}

export function webRoutes(router: Router): Router {
  router.all('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '..', '../dist/test', '/index.html'));
  });

  return router;
}
