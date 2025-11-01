# Neopets Tribute Website

A nostalgic tribute to Neopets featuring all pets, colors, and avatars. This website showcases the amazing artwork and variety from the classic Neopets game.

## 🎯 Project Overview

This is a modern web application built with Next.js that displays:

- All 55+ Neopet species
- All color combinations (7,000+ images)
- Avatars gallery
- Search and discovery features
- Nostalgic, beautiful UI/UX

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd neopets
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Copy images to public directory (optional, for static serving):

```bash
npm run copy-images
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
neopets-tribute/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   ├── pets/         # Pet-specific components
│   │   ├── colors/       # Color-specific components
│   │   └── avatars/      # Avatar-specific components
│   └── (routes)/         # Page routes
├── lib/                   # Utility functions
│   ├── imagePaths.ts     # Image path helpers
│   └── utils.ts          # General utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── data/                  # Local data files
│   └── neopets/
│       └── art/          # All Neopet images (7,000+)
├── scripts/               # Utility scripts
│   ├── download-neopets.js  # Image download script
│   └── copy-images.js    # Image copy script
└── public/                # Static assets
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run copy-images` - Copy images from data/ to public/

### Code Quality

This project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

Code is automatically formatted and linted before each commit.

## 📦 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Database**: PostgreSQL (to be set up)
- **Caching**: Redis (to be set up)

## 🖼️ Images

All Neopet images are stored locally in `data/neopets/art/` with the structure:

```
{pet_name}/{gender}/{color_name}.png
```

Images are served via:

- Static assets from `public/neopets/art/` (if copied)
- Or via API route `/api/images/[...path]`

See `lib/imagePaths.ts` for helper functions to resolve image paths.

## 📝 Documentation

- [Product Requirements Document (PRD)](./PRD.md)
- [Technical Requirements Document (TRD)](./TRD.md)
- [MVP Delivery Plan](./MVP_Delivery_Plan.md)

## 🚧 Development Status

**Phase 0: Foundation & Setup** (Week 1-2) ✅ In Progress

- [x] Project initialization
- [x] Next.js setup with TypeScript
- [x] ESLint, Prettier, Husky configuration
- [ ] Git repository setup
- [ ] Database setup
- [ ] Image serving configuration

## 📄 License

MIT

## 🙏 Acknowledgments

This is a tribute project celebrating the nostalgia of Neopets. All Neopets content is property of JumpStart Games.
