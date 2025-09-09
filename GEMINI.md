# GEMINI Code Assistant Context

This document provides context for the Gemini code assistant to understand the project structure, conventions, and important files.

## Project Overview

This is a web application for managing and displaying a history of read books. It is built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).

The main features of the application are:
- Displaying a grid of books that have been read.
- Filtering the books by the year they were read.
- Infinite scrolling to progressively load more books.
- A detail page for each book with more information.
- A responsive design that works on both desktop and mobile.

The book data is stored in a CSV file at `public/books.csv` and is converted into a TypeScript module at `public/books.ts` by running the `npm run convert` command.

## Building and Running

The following commands are available to build, run, and test the application:

- **`npm run dev`**: Starts the development server at `http://localhost:3000`.
- **`npm run build`**: Creates a production-ready build of the application.
- **`npm run start`**: Starts the production server.
- **`npm run format`**: Formats the code using [Prettier](https://prettier.io/).
- **`npm run convert`**: Converts the `public/books.csv` file to `public/books.ts`.

## Development Conventions

### Code Style

The project uses ESLint and Prettier to enforce a consistent code style. Before committing any changes, please run `npm run lint` and `npm run format` to ensure the code adheres to the project's style guidelines.

### Testing

The project has two types of tests:

1.  **Unit and Integration Tests**: These are located in the `__tests__` directory and are written using [Jest](https.jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
2.  **End-to-End Tests**: These are located in the `e2e` directory and are written using [Playwright](https://playwright.dev/).

When adding new features, please add corresponding tests to ensure the new code is working correctly and does not break existing functionality.

### Data Management

To add a new book to the application, add a new row to the `public/books.csv` file and then run the `npm run convert` command to update the `public/books.ts` file. The `convert.js` script will automatically generate a unique ID for the new book.
