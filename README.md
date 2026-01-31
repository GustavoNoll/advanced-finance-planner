# Foundation

![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)

A modern financial planning application built with React, TypeScript, and Vite.

## Technologies Used

This project is built with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **State Management**: React Query
- **Database**: Supabase
- **Backend**: Express.js
- **Additional Features**:
  - Drag and Drop (dnd-kit)
  - Charts (Recharts)
  - Form Handling (React Hook Form + Zod)
  - Internationalization (i18next)
  - Date Handling (date-fns)
  - Currency Input (react-currency-input-field)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or bun

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd advanced-finance-planner
```

2. Install dependencies:
```sh
npm install
# or
bun install
```

3. Start the development servers (frontend + backend):
```sh
npm run dev
```

Isso iniciará ambos os servidores simultaneamente:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

Para iniciar apenas um deles:
```sh
npm run dev:frontend  # Apenas frontend
npm run dev:backend   # Apenas backend
```

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run dev:frontend` - Start the frontend development server
- `npm run dev:backend` - Start the backend development server
- `npm run build` - Build frontend for production
- `npm run build:frontend` - Build frontend for production
- `npm run build:backend` - Build backend
- `npm run lint` - Run ESLint on frontend
- `npm run preview` - Preview the production build
- `npm run vercel-build` - Build for Vercel deployment
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI

## Project Structure

Este projeto usa uma estrutura de **monorepo** com workspaces:

- `/packages/frontend` - Frontend React + Vite
- `/packages/backend` - Backend Express.js (Serverless Functions)
- `/packages/shared` - Código compartilhado (types, utils)
- `/public` - Static assets (movido para packages/frontend/public)
- `/dist` - Production build output (gerado em packages/frontend/dist)

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Query for server state management
- React Router for navigation

## Testing

The project uses Vitest for testing. Tests are located in the `/tests` directory.

### Running Tests

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### i18n Translation Validation

The project includes automated tests to ensure translation consistency between languages:

- Validates that all keys in `pt-BR` exist in `en-US`
- Validates that all keys in `en-US` exist in `pt-BR`
- Ensures no empty translation values
- Checks for the same number of keys across languages

These tests run automatically on every push and pull request via GitHub Actions.

For more details, see [`tests/README.md`](tests/README.md).

## Deployment

The project is configured for deployment on Vercel with the `vercel.json` configuration file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
