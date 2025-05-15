export interface IRedisConfig {
  host: string;
  port: number;
  ttl: number;
  password?: string;
  db?: number;
}
