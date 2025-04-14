# NextWealth

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

3. Start the development server:
```sh
npm run dev
```

4. Start the backend server (in a separate terminal):
```sh
npm run server
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build
- `npm run server` - Start the backend server
- `npm run vercel-build` - Build for Vercel deployment

## Project Structure

- `/src` - Frontend source code
- `/server` - Backend Express.js server
- `/public` - Static assets
- `/dist` - Production build output

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Query for server state management
- React Router for navigation

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
