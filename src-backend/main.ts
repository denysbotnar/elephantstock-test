require('dotenv').config();
import { connect } from './app/database';
import { appService } from './app/app';

async function bootstrap(): Promise<void> {
  try {
    await connect();
    console.log('Connection has been established successfully.');

    appService().start();
    console.log(`HTTP server started on http://${process.env.BACKEND_HTTP_URI}`);
  } catch (e) {
    console.error('Server error', e);
  }
}

(async (): Promise<void> => await bootstrap())();
