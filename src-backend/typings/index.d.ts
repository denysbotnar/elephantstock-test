declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    HTTP_HOST: string;
    HTTP_PORT: string;
    BACKEND_HTTP_URI: string;
    FRONTEND_URI: string;
    DB_CONNECTION_URI: string;
  }
}
