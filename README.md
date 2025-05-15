# Article Management API
A NestJS-based API for managing articles with authentication, caching, and database persistence.

## Features
- 🚀 CRUD Operations for articles

- 🔐 JWT Authentication for protected routes

- ⚡ Redis Caching for improved performance

- 📝 TypeORM for database operations

- 📊 Pagination & Filtering for article listings

- 🛡️ Authorization (users can only modify their own articles)

## Technologies Used
- [NestJS](https://nestjs.com/) - Framework

- [TypeORM](https://typeorm.io/) - Database ORM

- [PostgreSQL](https://www.postgresql.org/) - Database

- [Redis](https://redis.io/) - Caching

- [JWT](https://jwt.io/) - Authentication

- [Swagger](https://swagger.io/) - API Documentation

## Installation and Launch
1. Clone the repository
```bash
git clone https://github.com/Xayrulloh/QTIM.git
cd QTIM
```
2. Install dependencies
```bash
pnpm install
```
3. Set up environment variables: (Edit .env with your configuration.)
```bash
cp .env.example .env
```
4. Run the application using docker compose
```bash
docker compose up --build
```

## API Documentation
After starting the app, access Swagger UI at:
> http://localhost:$PORT/api

## Testing
Run unit tests:
```bash
pnpm test
```
Run tests with coverage:
```bash
pnpm test:cov
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.