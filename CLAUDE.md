# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for managing reading history (読書管理). It displays a collection of books that have been read, with filtering capabilities by year and detailed individual book pages.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with ESLint and Prettier

## Architecture

### Data Management

- Book data is stored in `/public/books.ts` as a TypeScript export containing an array of book objects
- Each book has: id (SHA-256 hash), title, author, publisher, isbn, readDate, thumnailImage
- Raw data originates from `/public/books.csv` and is converted using `convert.js`

### Data Pipeline

- CSV data → `convert.js` script → `export.json` → manually copied to `books.ts`
- The conversion script creates unique IDs by hashing title+author and cleans thumbnail URLs

### Pages Structure

- `/pages/index.tsx` - Main page with book grid, year filtering, and infinite scroll
- `/pages/items/[id].tsx` - Dynamic detail pages for individual books
- `/pages/_app.tsx` - Next.js app wrapper with global styles

### Key Features

- **Infinite Scroll**: Uses IntersectionObserver to load 48 books at a time
- **Year Filtering**: Filter books by read date year (2015-2024, plus "All")
- **Image Optimization**: Next.js Image component with configured remote patterns
- **SEO Metadata**: Dynamic metadata generation for book detail pages

### Image Hosting

The app supports images from multiple sources configured in `next.config.js`:

- Rakuten thumbnail servers
- Amazon media servers
- BOOTH image servers

### Styling

- CSS Modules (`/styles/Home.module.css`, `/styles/Detail.module.css`)
- Global styles in `/styles/globals.css`
- FontAwesome icons loaded via CDN

## Data Updates

To add new books:

1. Update `/public/books.csv` with new entries
2. Run `node convert.js` to generate `export.json`
3. Manually copy the JSON array content to `/public/books.ts`
4. Update year filter buttons in `/pages/index.tsx` if adding new years

## Common Tasks

- **Adding books**: Follow the data update process above
- **Testing locally**: Use `npm run dev` and visit http://localhost:3000
- **Code quality**: Run `npm run lint` before committing
- **Production build**: Use `npm run build` to verify build succeeds
