import serverless from 'serverless-http';
import app from '../../server.js';

export const handler = serverless(app);

export const config = {
  path: "/api/*"
};
