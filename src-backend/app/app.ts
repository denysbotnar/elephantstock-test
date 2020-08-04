import express, { Express, Router } from 'express';
import http, { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { apiRoutes, webRoutes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export interface IAppService {
  app: Express;
  config(): void;
  start(): {
    server: Server;
  };
}

export function appService(): IAppService {
  const app = express();

  function config(): void {
    app.use(cors());
    app.use([bodyParser.json()]);
    app.use(express.static('dist/test'));
    app.use('/api/v1', apiRoutes(Router({ caseSensitive: true })));
    app.use('/', webRoutes(Router({ caseSensitive: true })));
    app.use(errorMiddleware);
  }

  function start(): { server: Server } {
    config();

    return {
      server: http.createServer(app).listen(Number(process.env.HTTP_PORT), process.env.HTTP_HOST),
    };
  }

  return { app, config, start };
}
