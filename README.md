# OrderManager API - Back-end

The OrderManager API helps your restaurant manage its orders.

## About

This API enables users to place orders, with or without observations, and choose from multiple payment methods. The kitchen receives the order and can update the order status to ready or cancelled. There is an endpoint to display the ready orders that have not been picked up and the unfinished orders.

[OrderManager API Deploy](https://ordermanager-api.onrender.com)

[Documentation](https://ordermanager-api.onrender.com/doc)

## Technologies

* **TypeScript:** to assist in development.
* **Node and Express:** to construct a robust server.
* **PrismaORM:** to handle DB versioning and communicate with the database.
* **ESLint:** to ensure the code follows good patterns.
* **Jest and supertest:** for automated API testing, ensuring the API functions correctly and securely.
* **Swagger:** for displaying the OpenAPI documentation of the OrderManager API.

## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example` file (see "Running application locally or inside docker section" for details)
5. Run all migrations

```bash
npm run dev:migration:run
```

6. Seed db

```bash
npm run dev:seed
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

7. Acess http://localhost:4000/doc/ to see the documentation

## How to run tests

1. Follow the steps in the last section
2. Configure the `.env.test` file using the `.env.example` file (see "Running application locally or inside docker" section for details)
3. Run all migrations:

```bash
npm run test:migration:run
```

4. Run test:

```bash
npm run test
```

## Building and starting for production

```bash
npm run build
npm start
```

## Running migrations or generate prisma clients

Before running migrations make sure you have a postgres db running based on `.env.development` or `.env.test` file for each environment.

You can operate on databases for different environments, but it is necessary to populate correct env variables for each environment first, so in order to perform db operations type the following commands:

- `npm run dev:migration:run` - run migrations for development environment by loading envs from .env.development file. It uses [dotenv-cli](https://github.com/entropitor/dotenv-cli#readme) to load envs from .env.development file.
- `npm run test:migration:run` - the same, but for test environment.

- `npm run dev:migration:generate -- --name ATOMIC_OPERATION_NAME` - generate and run migration and prisma client for development environment by loading envs from .env.development file. Replace `ATOMIC_OPERATION_NAME` by the name of the migration you want to generate.

## What to do when add new ENV VARIABLES

There are several things you need to do when you add new ENV VARIABLES:
- Add them to `.env.example` file
- Add them to your local `.env.development` and `.env.test` files