# Development Guidelines

## Project Overview

This is an Angular (v20) blog application using TypeScript, Apollo Client for GraphQL, and Angular Material for UI components.

## Code Style

### TypeScript/Angular

- Use **TypeScript** with strict mode enabled (as per tsconfig.json)
- Follow **Angular Style Guide** (https://angular.io/guide/styleguide)
- Use **PascalCase** for class names and interfaces
- Use **I** prefix for typescript interfaces
- Use **Enum** suffix for typescript enums
- Use **camelCase** for variables, functions, and methods
- Use **UPPER_CASE** for constants
- Use **kebab-case** for file names (e.g., `article.service.ts`)
- Use **dash-case** for component selectors (e.g., `app-article`)
- Use **unknown** instead of **any** in typescript
- Use object with **next**, **error**, and **complete** when subscribing to observables
- Prefer **interfaces** over types unless you need union types or other type-specific features

### File Structure

```
src/
  app/
    components/      # Dumb components (presentational)
    containers/      # Smart components (container components)
    services/        # Services and API clients
    models/          # TypeScript interfaces/types
    shared/          # Shared modules, pipes, directives
    app.module.ts    # Root module
    app-routing.module.ts # Routing configuration
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

## Development Practices

### Testing

- Write unit tests for all services, pipes, and components with complex logic
- The tests must use Vitest package
- Run tests before pushing code: `pnpm test`
- Aim for at least 90% test coverage

### Code Quality

- Run linter before committing: `pnpm lint`
- Fix all linting errors before pushing code
- Use ESLint and Prettier for consistent code formatting
- Keep functions small and focused on a single responsibility
- Write self-documenting code with meaningful variable and function names

### Performance

- Use OnPush change detection strategy for better performance
- Unsubscribe from observables to prevent memory leaks
- Use `trackBy` with `@for` for better rendering performance
- Lazy load feature modules
- use Signals wherever possible instead of the rxjs, unless rxjs makes more sense

## CI/CD

- The project uses Jenkins for CI/CD (see `cicd/` directory)
- Automated tests run on every push
- The build process includes:
    - Linting
    - Unit tests
    - Production build
    - Sitemap generation

## Environment Variables

- Use `.env` file for local development (add to `.gitignore`)
- Never commit sensitive information to version control
- Document required environment variables in `.env.example`

## Documentation

- Document complex business logic with comments
- Keep the README.md up to date
- Document component props and methods using JSDoc

## Pull Requests

- Keep PRs small and focused on a single feature/fix
- Include a clear description of changes
- Reference related issues
- Request code reviews from at least one team member
- Ensure all tests pass before requesting review

## Dependencies

- Keep dependencies up to date
- Review and update dependencies regularly
- Document any breaking changes when updating major versions

## Accessibility

- Follow WCAG 2.1 guidelines
- Use semantic HTML
- Add proper ARIA attributes when needed
- Ensure keyboard navigation works correctly
- Test with screen readers

## Security

- Sanitize all user inputs
- Use Angular's built-in XSS protection
- Follow Angular's security best practices
- Keep dependencies updated to avoid known vulnerabilities
