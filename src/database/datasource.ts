import { DataSource } from 'typeorm';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: [Article, User],
  migrations: ['src/database/migrations/*.ts'],
});
