# Agent Guidelines for Book Read History

## Build/Lint/Test Commands
- **Build**: `npm run build` (Next.js production build)
- **Dev server**: `npm run dev` (starts on localhost:3000)
- **Lint**: `npm run lint` (Biome linter)
- **Format**: `npm run format` (Biome formatter) or `npm run lint:fix` (Biome auto-fix)
- **Data conversion**: `npm run convert` or `npm run books:update` (CSV to TypeScript)
- **Test**: No test runner configured (Playwright available in dependencies but no test scripts)

## Code Style Guidelines

### TypeScript & React
- Use TypeScript with strict mode enabled
- Define interfaces for component props
- Use functional components with hooks
- Follow PascalCase for component names and types
- Use camelCase for variables, functions, and properties

### Imports & Paths
- Use absolute imports with path aliases: `@/components/*`, `@/hooks/*`, `@/styles/*`, `@/types/*`
- Group imports: external packages first, then internal modules
- Use relative imports only for files in the same directory

### Formatting & Linting
- 2-space indentation (Biome configuration)
- Use Biome for consistent formatting and linting
- Include TypeScript files (*.ts, *.tsx) only, exclude node_modules

### Naming Conventions
- Components: PascalCase (e.g., `BookCard`, `YearFilter`)
- Hooks: camelCase with `use` prefix (e.g., `useBookFilter`)
- Types/Interfaces: PascalCase (e.g., `Book`, `Highlight`)
- Files: PascalCase for components, camelCase for utilities

### Error Handling
- Leverage TypeScript strict mode for compile-time error prevention
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Handle async operations with proper error boundaries where needed

### Styling
- Use Tailwind CSS classes for styling
- Follow responsive design patterns
- Use CSS Modules for component-specific styles when needed
- Include accessibility attributes (aria-label, role, tabIndex)

### Best Practices
- Use Next.js Image component for optimized images
- Implement proper keyboard navigation and ARIA labels
- Store user preferences in sessionStorage with SSR-safe checks
- Follow Japanese language conventions for UI text and comments