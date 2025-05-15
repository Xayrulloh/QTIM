export interface IConfig {
  port: number;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
    ttl: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  swagger: {
    title: string;
    description: string;
    version: string;
  };
}
