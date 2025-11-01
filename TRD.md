# Technical Requirements Document: Neopets Tribute Website

## 1. Executive Summary

This document outlines the technical architecture, technology stack, and implementation approach for building a nostalgic Neopets tribute website. The system will be built as a modern, scalable web application using locally stored Neopet images and metadata.

### 1.1 Technical Goals

- **Performance**: Fast page loads (< 2s), smooth interactions (60fps)
- **Scalability**: Support 10,000+ concurrent users
- **Maintainability**: Clean code, modular architecture, comprehensive testing
- **Reliability**: 99.9% uptime, robust error handling
- **Security**: Secure data handling, protection against common vulnerabilities

### 1.2 Architecture Principles

- **Separation of Concerns**: Clear boundaries between frontend, backend, and data layer
- **API-First Design**: RESTful APIs for all data operations
- **Local-First Images**: All Neopet images are stored locally for fast, reliable access
- **Microservices-Ready**: Modular design allows future service extraction
- **Cloud-Native**: Designed for cloud deployment with scalability in mind
- **Developer Experience**: Easy local development, comprehensive tooling

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │  API Client  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     CDN (CloudFlare)                         │
│            Static Assets | Images | Caching                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────────────────────────────────┐      │
│  │           Next.js Frontend Application            │      │
│  │  - React Components                                │      │
│  │  - Server-Side Rendering                           │      │
│  │  - Static Generation                               │      │
│  │  - API Routes                                      │      │
│  └────────────────────────────────────────────────────┘      │
│                            │                                  │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────────┐      │
│  │              Backend API Server                    │      │
│  │  - Node.js + Express/Fastify                       │      │
│  │  - RESTful API                                     │      │
│  │  - Authentication                                  │      │
│  │  - Business Logic                                  │      │
│  └────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │ Local Images │      │
│  │   (Primary)  │  │   (Cache)    │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Local Image Repository                          │
│  /data/neopets/art/{pet}/{gender}/{color}.png              │
│  - All 7,000+ Neopet images locally stored                  │
│  - Served as static assets via Next.js                      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

#### Frontend Application

- Next.js React application
- Server-side rendering for SEO
- Static generation for performance
- Client-side interactivity

#### Backend API

- RESTful API server
- Business logic and data processing
- Authentication (if user accounts)
- Data validation

#### Database

- PostgreSQL for structured data (pet metadata, colors, avatars)
- Redis for caching and sessions
- Local file system for images (`/data/neopets/art/`)

#### Image Storage

- All Neopet images stored locally in organized directory structure
- Structure: `data/neopets/art/{pet_name}/{gender}/{color_name}.png`
- Images served as static assets through Next.js public directory or API routes
- No external image hosting required

---

## 3. Technology Stack

### 3.1 Frontend Stack

#### Core Framework

**Next.js 14+ (App Router)**

- **Rationale**:
  - Server-side rendering for SEO
  - Static generation for performance
  - Built-in API routes
  - Excellent image optimization
  - TypeScript support
  - Great developer experience
- **Alternatives Considered**:
  - Remix (less ecosystem)
  - SvelteKit (smaller community)

#### Language

**TypeScript 5+**

- **Rationale**:
  - Type safety
  - Better IDE support
  - Improved maintainability
  - Reduced runtime errors

#### Styling

**Tailwind CSS 3+**

- **Rationale**:
  - Utility-first, fast development
  - Small bundle size
  - Excellent responsive design
  - Great customization
- **Complementary**:
  - Framer Motion for animations
  - Headless UI for accessible components

#### State Management

**React Context + React Query (TanStack Query)**

- **Rationale**:
  - React Query for server state
  - Context for global UI state
  - Simpler than Redux for this use case
  - Built-in caching and synchronization

#### Image Handling

**Next.js Image Component + Sharp**

- **Rationale**:
  - Automatic optimization
  - Responsive images
  - Lazy loading
  - WebP/AVIF support

#### Animations

**Framer Motion**

- **Rationale**:
  - Declarative animations
  - Great performance
  - Gesture support
  - Layout animations

#### Forms & Validation

**React Hook Form + Zod**

- **Rationale**:
  - Performant form handling
  - Type-safe validation
  - Great developer experience

---

### 3.2 Backend Stack

#### Runtime

**Node.js 20 LTS**

- **Rationale**:
  - Same language as frontend
  - Large ecosystem
  - Excellent performance
  - Good async support

#### Framework

**Fastify** (or Express.js)

- **Rationale**:
  - Fast performance
  - Plugin ecosystem
  - Built-in TypeScript support
  - Good async/await support
- **Alternative**: Express.js (more familiar, larger ecosystem)

#### API Specification

**OpenAPI/Swagger**

- **Rationale**:
  - API documentation
  - Type generation
  - Testing support

#### Validation

**Zod**

- **Rationale**:
  - TypeScript-first
  - Runtime validation
  - Shared with frontend

---

### 3.3 Database Stack

#### Primary Database

**PostgreSQL 15+**

- **Rationale**:
  - Robust relational database
  - Excellent JSON support
  - Full-text search
  - Proven scalability
  - ACID compliance

#### ORM/Query Builder

**Prisma**

- **Rationale**:
  - Type-safe queries
  - Excellent migration system
  - Great TypeScript support
  - Intuitive API
- **Alternative**: Drizzle ORM (lighter weight)

#### Caching

**Redis 7+**

- **Rationale**:
  - Fast in-memory cache
  - Session storage
  - Rate limiting
  - Pub/sub for real-time features

#### Search

**PostgreSQL Full-Text Search** (initially)

- **Future Option**: Elasticsearch or Meilisearch if needed

---

### 3.4 Image Storage & Serving

#### Local Image Storage

**File System Structure**

- **Location**: `/data/neopets/art/` (or `public/neopets/art/` in Next.js)
- **Structure**: `{pet_name}/{gender}/{color_name}.png`
- **Rationale**:
  - All 7,000+ images already downloaded and organized
  - Fast local access
  - No external dependencies
  - Easy to version control structure
  - Direct file serving via Next.js static assets

#### Image Serving Strategy

**Next.js Static Assets**

- **Option 1**: Copy images to `public/neopets/art/` during build
- **Option 2**: Serve via API route with Next.js Image optimization
- **Option 3**: Use symbolic links from `public/` to `data/`
- **Rationale**:
  - Leverages Next.js Image component optimization
  - Automatic WebP/AVIF conversion
  - Responsive image generation
  - Lazy loading support

#### Optional CDN

**CloudFlare CDN** (for production)

- **Rationale**:
  - Global distribution (if needed)
  - Image optimization
  - DDoS protection
  - Can cache static assets from Vercel/Next.js

---

### 3.5 Data Import & Processing

#### Image Data Structure

**Local File Organization**

- Images already organized by: `{pet_name}/{gender}/{color_name}.png`
- Metadata in JSON files: `data/{pet_name}.json`
- No scraping needed for images - all downloaded locally

#### Data Processing Scripts

**Node.js Scripts**

- Image path resolution utilities
- Metadata import scripts
- Image validation and verification
- Build-time image processing (if needed)

#### Future Updates (Optional)

**Image Update Process**

- Manual download script for new colors/pets (already exists)
- Script to check for missing images
- Validation against JSON metadata

---

### 3.6 Infrastructure & DevOps

#### Hosting - Frontend

**Vercel**

- **Rationale**:
  - Made for Next.js
  - Excellent performance
  - Automatic deployments
  - Great developer experience
  - Generous free tier

#### Hosting - Backend

**Railway** (or Render, Fly.io)

- **Rationale**:
  - Easy deployment
  - Good database support
  - Reasonable pricing
  - Docker support
- **Alternatives**:
  - Render (similar features)
  - Fly.io (better global distribution)

#### Build Process

**Image Optimization**

- Copy/process images during build
- Generate optimized versions if needed
- Create image manifest for API

#### CI/CD

**GitHub Actions**

- **Rationale**:
  - Integrated with GitHub
  - Free for public repos
  - Great ecosystem
  - Easy setup

#### Monitoring

**Sentry**

- **Rationale**:
  - Error tracking
  - Performance monitoring
  - Good free tier

#### Analytics

**Plausible Analytics** (or Google Analytics)

- **Rationale**:
  - Privacy-focused
  - Simple
  - Lightweight
- **Alternative**: Google Analytics (more features, privacy concerns)

---

### 3.7 Development Tools

#### Package Manager

**pnpm**

- **Rationale**:
  - Faster than npm
  - Disk space efficient
  - Better monorepo support

#### Code Quality

**ESLint + Prettier**

- **Rationale**:
  - Code consistency
  - Automatic formatting
  - Catch errors early

#### Testing

**Vitest** (unit tests)
**Playwright** (E2E tests)

- **Rationale**:
  - Vitest is fast, Vite-based
  - Playwright has great browser support
  - Good TypeScript support

#### Type Checking

**TypeScript Compiler**

- **Rationale**:
  - Built-in to TypeScript
  - Fast incremental checks

---

## 4. Detailed System Design

### 4.1 Frontend Architecture

#### 4.1.0 Image Setup for Next.js

**Local Image Integration**
Since all images are stored in `data/neopets/art/`, we need to make them accessible to Next.js:

**Option 1: Copy to Public Directory (Recommended)**

```bash
# Create a build script in package.json
"scripts": {
  "copy-images": "node scripts/copy-images.js",
  "build": "npm run copy-images && next build"
}
```

```javascript
// scripts/copy-images.js
const fs = require('fs-extra')
const path = require('path')

async function copyImages() {
  const source = path.join(__dirname, '..', 'data', 'neopets', 'art')
  const dest = path.join(__dirname, '..', 'public', 'neopets', 'art')

  await fs.ensureDir(dest)
  await fs.copy(source, dest)
  console.log('✅ Images copied to public directory')
}

copyImages()
```

**Option 2: Use API Route (For Dynamic Serving)**

```typescript
// app/api/images/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const imagePath = path.join(process.cwd(), 'data', 'neopets', 'art', ...params.path)

  try {
    const file = await fs.readFile(imagePath)
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
```

**Option 3: Symlink (Development Only)**

```bash
# Create symbolic link
ln -s ../../data/neopets/art public/neopets/art
```

#### 4.1.1 Next.js App Router Structure

```
app/
├── (marketing)/              # Marketing/public pages
│   ├── page.tsx              # Homepage
│   ├── about/
│   └── layout.tsx
├── (browse)/                 # Browse pages
│   ├── pets/
│   │   ├── page.tsx          # Pet list
│   │   └── [slug]/
│   │       └── page.tsx      # Pet detail
│   ├── colors/
│   └── avatars/
├── (app)/                    # App pages
│   ├── collections/
│   ├── wishlist/
│   └── layout.tsx            # App layout with nav
├── api/                      # API routes
│   ├── search/
│   ├── random/
│   └── collections/
├── components/               # Reusable components
│   ├── ui/                   # Base UI components
│   ├── pets/                 # Pet-specific components
│   ├── colors/               # Color-specific components
│   └── avatars/              # Avatar-specific components
├── lib/                      # Utilities
│   ├── api.ts                # API client
│   ├── utils.ts              # Helper functions
│   └── constants.ts
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── styles/                   # Global styles
└── layout.tsx                # Root layout
```

#### 4.1.2 Component Architecture

**Atomic Design Pattern**

```
components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Icon/
│   └── Badge/
├── molecules/
│   ├── SearchBar/
│   ├── FilterPanel/
│   ├── Card/
│   └── ComparisonGrid/
├── organisms/
│   ├── PetGrid/
│   ├── ColorGallery/
│   ├── AvatarGallery/
│   ├── Navigation/
│   └── CollectionView/
└── templates/
    ├── BrowseLayout/
    ├── DetailLayout/
    └── CollectionLayout/
```

#### 4.1.3 State Management Strategy

**Server State (React Query)**

```typescript
// hooks/usePets.ts
export function usePets(filters: PetFilters) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: () => api.getPets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// hooks/usePet.ts
export function usePet(slug: string) {
  return useQuery({
    queryKey: ['pet', slug],
    queryFn: () => api.getPet(slug),
  })
}
```

**Client State (React Context)**

```typescript
// contexts/FilterContext.tsx
- Current filter state
- Active search query
- UI preferences (view mode, etc.)

// contexts/CollectionContext.tsx
- User collections (if client-side only)
- Wishlist items
```

**URL State**

- Search parameters
- Filter states
- Current page
- Sort options

#### 4.1.4 Data Fetching Strategy

**Static Generation (SSG)**

- Pet species list
- Static content pages
- SEO-important pages

**Server-Side Rendering (SSR)**

- Dynamic pet/color/avatar pages
- Search results
- User-specific pages

**Incremental Static Regeneration (ISR)**

- Pet detail pages (revalidate every hour)
- Color galleries (revalidate daily)

**Client-Side Fetching**

- Filter updates
- Search queries
- User interactions
- Real-time data

---

### 4.2 Backend Architecture

#### 4.2.1 API Structure

```
src/
├── routes/
│   ├── pets.ts
│   ├── colors.ts
│   ├── avatars.ts
│   ├── search.ts
│   ├── collections.ts
│   └── auth.ts
├── controllers/
│   ├── petController.ts
│   ├── colorController.ts
│   └── avatarController.ts
├── services/
│   ├── petService.ts
│   ├── colorService.ts
│   ├── searchService.ts
│   └── cacheService.ts
├── models/
│   ├── Pet.ts
│   ├── Color.ts
│   └── Avatar.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   ├── rateLimit.ts
│   └── errorHandler.ts
├── utils/
│   ├── logger.ts
│   ├── validator.ts
│   └── formatter.ts
└── config/
    ├── database.ts
    ├── redis.ts
    └── constants.ts
```

#### 4.2.2 API Design

**RESTful Endpoints**

```
# Pets
GET    /api/v1/pets                    # List pets
GET    /api/v1/pets/:slug              # Get pet by slug
GET    /api/v1/pets/:slug/colors       # Get colors for pet

# Colors
GET    /api/v1/colors                  # List colors (with filters)
GET    /api/v1/colors/:id              # Get color detail
GET    /api/v1/colors/:id/compare      # Get comparable colors

# Avatars
GET    /api/v1/avatars                 # List avatars
GET    /api/v1/avatars/:slug           # Get avatar detail

# Search
GET    /api/v1/search?q=query           # Unified search
GET    /api/v1/search/suggestions      # Search autocomplete

# Random
GET    /api/v1/random/pet              # Random pet
GET    /api/v1/random/color            # Random color
GET    /api/v1/random/avatar           # Random avatar

# Collections (if authenticated)
GET    /api/v1/collections             # List user collections
POST   /api/v1/collections             # Create collection
GET    /api/v1/collections/:id         # Get collection
PUT    /api/v1/collections/:id         # Update collection
DELETE /api/v1/collections/:id         # Delete collection

# Wishlist (if authenticated)
GET    /api/v1/wishlist                # Get wishlist
POST   /api/v1/wishlist                # Add to wishlist
DELETE /api/v1/wishlist/:id            # Remove from wishlist
```

**Response Format**

```typescript
// Success Response
{
  data: T,
  meta?: {
    total?: number,
    page?: number,
    pageSize?: number,
    filters?: Record<string, any>
  }
}

// Error Response
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

#### 4.2.3 Caching Strategy

**Redis Cache Layers**

1. **API Response Cache**
   - Cache key: `api:v1:pets:list:{hash(filters)}`
   - TTL: 5 minutes for lists, 1 hour for details
   - Invalidate on data updates

2. **Database Query Cache**
   - Cache expensive queries
   - Cache key: `db:query:{query_hash}`
   - TTL: 15 minutes

3. **Search Results Cache**
   - Cache search queries
   - Cache key: `search:{query_hash}`
   - TTL: 10 minutes

4. **Rate Limiting**
   - Store rate limit counters in Redis
   - Key: `rate_limit:{ip}:{endpoint}`
   - TTL: 1 minute window

**Cache Invalidation**

- On content updates (data imports)
- Manual invalidation API
- Time-based expiration

---

### 4.3 Database Schema

#### 4.3.1 Entity Relationship Diagram

```
┌─────────────┐
│ Pet Species │
│─────────────│
│ id (PK)     │
│ name        │
│ slug        │
│ category    │
│ ...         │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│   Color     │
│─────────────│
│ id (PK)     │
│ pet_id (FK) │
│ name        │
│ slug        │
│ rarity      │
│ ...         │
└─────────────┘

┌─────────────┐
│   Avatar    │
│─────────────│
│ id (PK)     │
│ name        │
│ slug        │
│ category    │
│ difficulty  │
│ ...         │
└─────────────┘

┌─────────────┐     ┌─────────────┐
│ Collection  │────▶│ Collection  │
│             │ M:N │   Item      │
│ id (PK)     │     │             │
│ user_id     │     │ item_type   │
│ name        │     │ item_id     │
│ ...         │     └─────────────┘
└─────────────┘
```

#### 4.3.2 Detailed Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model PetSpecies {
  id            String   @id @default(uuid())
  name          String   @unique
  slug          String   @unique
  category      String?
  description   String?
  imagePath     String   // Local path: /neopets/art/{slug}/female/{default_color}.png
  totalColors   Int      @default(0)
  popularityScore Float  @default(0)
  tags          String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  colors        Color[]

  @@index([slug])
  @@index([category])
  @@index([popularityScore])
}

model Color {
  id            String   @id @default(uuid())
  petSpeciesId String
  name          String
  slug          String
  type          ColorType
  rarity        Rarity
  imagePathFemale String // Local path: /neopets/art/{pet_slug}/female/{color_slug}.png
  imagePathMale   String // Local path: /neopets/art/{pet_slug}/male/{color_slug}.png
  releaseDate   DateTime?
  costNp        Int?
  costNc        Int?
  obtainMethod  String?
  isAvailable   Boolean  @default(true)
  description   String?  @db.Text
  tags          String[]
  metadata      Json?    // Flexible storage for extra data (e.g., Neopets ID, UCexist)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  petSpecies    PetSpecies @relation(fields: [petSpeciesId], references: [id], onDelete: Cascade)

  @@unique([petSpeciesId, slug])
  @@index([petSpeciesId])
  @@index([rarity])
  @@index([type])
  @@index([isAvailable])
  @@index([releaseDate])
  @@fulltext([name, description])
}

model Avatar {
  id            String      @id @default(uuid())
  name          String      @unique
  slug          String      @unique
  imageUrl      String
  category      AvatarCategory
  difficulty    Difficulty
  isAvailable   Boolean     @default(true)
  requirements  String      @db.Text
  guide         String?     @db.Text
  releaseDate   DateTime?
  tips          String?     @db.Text
  rarityScore   Float       @default(0)
  tags          String[]
  metadata      Json?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([category])
  @@index([difficulty])
  @@index([isAvailable])
  @@index([rarityScore])
  @@fulltext([name, requirements, guide])
}

// User models (if user accounts implemented)
model User {
  id            String      @id @default(uuid())
  email         String?     @unique
  username      String?
  provider      AuthProvider?
  providerId    String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  collections   Collection[]
  wishlist      Wishlist?
}

model Collection {
  id            String      @id @default(uuid())
  userId        String
  name          String
  description   String?     @db.Text
  isPublic      Boolean     @default(false)
  items         Json        // Array of {type, id, notes?}
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isPublic])
}

model Wishlist {
  id            String      @id @default(uuid())
  userId        String      @unique
  items         Json        // Array of {type, id, priority, notes?}
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Enums
enum ColorType {
  STANDARD
  PAINT_BRUSH
  LAB_RAY
  LIMITED_EDITION
  SPECIAL
}

enum Rarity {
  COMMON
  UNCOMMON
  RARE
  ULTRA_RARE
  LIMITED_EDITION
}

enum AvatarCategory {
  BATTLE
  GAME
  RANDOM_EVENT
  SHOP
  SITE_EVENT
  PET_COLOR
  PET_SPECIES
  MISCELLANEOUS
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  VERY_HARD
  RETIRED
}

enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
}
```

#### 4.3.3 Database Indexes Strategy

**Performance Indexes**

```sql
-- Pet Species
CREATE INDEX idx_pets_category ON "PetSpecies"(category);
CREATE INDEX idx_pets_popularity ON "PetSpecies"("popularityScore" DESC);
CREATE INDEX idx_pets_slug ON "PetSpecies"(slug);

-- Colors
CREATE INDEX idx_colors_pet ON "Color"("petSpeciesId");
CREATE INDEX idx_colors_rarity ON "Color"(rarity);
CREATE INDEX idx_colors_type ON "Color"(type);
CREATE INDEX idx_colors_available ON "Color"("isAvailable") WHERE "isAvailable" = true;

-- Full-text search
CREATE INDEX idx_colors_search ON "Color" USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Avatars
CREATE INDEX idx_avatars_category ON "Avatar"(category);
CREATE INDEX idx_avatars_difficulty ON "Avatar"(difficulty);
```

**Composite Indexes**

```sql
-- For filtering pets with specific color characteristics
CREATE INDEX idx_colors_pet_rarity ON "Color"("petSpeciesId", rarity);
CREATE INDEX idx_colors_pet_type ON "Color"("petSpeciesId", type);
```

---

### 4.4 Image Path Management

#### 4.4.1 Image Path Helper Utilities

```typescript
// lib/imagePaths.ts
/**
 * Helper utilities for resolving local Neopet image paths
 */

export interface ImagePathOptions {
  petSlug: string
  colorName: string // Use actual color name (e.g., "oil paint", "polka dot") to match file names
  gender?: 'male' | 'female'
}

/**
 * Get the local file path for a Neopet image
 * @param options - Pet, color, and gender information
 * @returns Path relative to public directory (e.g., '/neopets/art/acara/female/blue.png')
 * @note colorName should match the JSON color name exactly (spaces preserved)
 */
export function getNeopetImagePath(options: ImagePathOptions): string {
  const { petSlug, colorName, gender = 'female' } = options
  return `/neopets/art/${petSlug}/${gender}/${colorName}.png`
}

/**
 * Get both male and female image paths for a color
 * Note: colorName should match the JSON file color name exactly (e.g., "oil paint", "polka dot")
 */
export function getColorImagePaths(petSlug: string, colorName: string) {
  return {
    female: getNeopetImagePath(petSlug, colorName, 'female'),
    male: getNeopetImagePath(petSlug, colorName, 'male'),
  }
}

/**
 * Validate that an image file exists (for build-time validation)
 */
export async function validateImageExists(imagePath: string): Promise<boolean> {
  // Implementation for checking file existence
  // Used during build or data import
}
```

#### 4.4.2 Image Path Resolution in API

```typescript
// services/imageService.ts
import { getNeopetImagePath } from '@/lib/imagePaths'

export class ImageService {
  /**
   * Resolve image paths for API responses
   * @param colorName - Use actual color name (e.g., "oil paint", not "oil-paint")
   */
  resolveImagePath(petSlug: string, colorName: string, gender: 'male' | 'female' = 'female') {
    // Returns path to local static asset
    // In production, this will be served from:
    // - public/neopets/art/ (if copied)
    // - Or via API route /api/images/[...path]

    return getNeopetImagePath({ petSlug, colorName, gender })
  }

  /**
   * Build image paths for database records
   * @param colorName - Use actual color name from JSON (preserves spaces)
   */
  buildImagePaths(petSlug: string, colorName: string) {
    return {
      female: getNeopetImagePath({ petSlug, colorName, gender: 'female' }),
      male: getNeopetImagePath({ petSlug, colorName, gender: 'male' }),
    }
  }
}
```

#### 4.4.3 Data Import from JSON Files

```typescript
// scripts/import-pet-data.ts
/**
 * Import pet data from JSON files and create image paths
 */
import fs from 'fs/promises'
import path from 'path'
import { getColorImagePaths } from '@/lib/imagePaths'

async function importPetData(petName: string) {
  const jsonPath = path.join(process.cwd(), 'data', `${petName}.json`)
  const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))

  const colors = Object.entries(data).map(([colorName, colorData]: [string, any]) => ({
    name: colorName,
    slug: colorName.toLowerCase().replace(/\s+/g, '-'),
    imagePathFemale: getColorImagePaths(petName, colorName).female,
    imagePathMale: getColorImagePaths(petName, colorName).male,
    // ... other metadata
  }))

  // Import to database
  // ...
}
```

---

## 5. API Specifications

### 5.1 API Endpoints Details

#### GET /api/v1/pets

**Description**: List all pet species with filtering and pagination

**Query Parameters**:

```typescript
{
  page?: number;           // Default: 1
  pageSize?: number;        // Default: 24
  category?: string;       // Filter by category
  sortBy?: 'name' | 'popularity' | 'colors'; // Default: 'name'
  order?: 'asc' | 'desc';  // Default: 'asc'
  search?: string;         // Search by name
}
```

**Response**:

```typescript
{
  data: Array<{
    id: string
    name: string
    slug: string
    category: string | null
    imagePath: string // e.g., '/neopets/art/acara/female/blue.png'
    totalColors: number
    popularityScore: number
  }>
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
```

#### GET /api/v1/pets/:slug

**Description**: Get detailed information about a specific pet species

**Response**:

```typescript
{
  data: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    description: string | null;
    imagePath: string; // Default color image path
    totalColors: number;
    popularityScore: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    colors: Array<{
      id: string;
      name: string;
      slug: string;
      type: ColorType;
      rarity: Rarity;
      imagePathFemale: string; // e.g., '/neopets/art/acara/female/blue.png'
      imagePathMale: string;   // e.g., '/neopets/art/acara/male/blue.png'
      isAvailable: boolean;
    }>;
  };
}
```

#### GET /api/v1/search

**Description**: Unified search across pets, colors, and avatars

**Query Parameters**:

```typescript
{
  q: string;               // Search query (required)
  type?: 'pets' | 'colors' | 'avatars' | 'all'; // Default: 'all'
  limit?: number;          // Default: 20
}
```

**Response**:

```typescript
{
  data: {
    pets: Array<PetSearchResult>
    colors: Array<ColorSearchResult>
    avatars: Array<AvatarSearchResult>
  }
  meta: {
    total: number
    query: string
  }
}
```

---

### 5.2 Authentication (Future Phase)

If user accounts are implemented:

**JWT-based Authentication**

```typescript
// POST /api/v1/auth/login
{
  email: string
  password: string
}

// Response
{
  data: {
    token: string
    user: {
      id: string
      email: string
      username: string
    }
  }
}
```

**Protected Routes**

- Require `Authorization: Bearer <token>` header
- Validate JWT token
- Extract user ID from token

---

## 6. Frontend Implementation Details

### 6.1 Component Examples

#### Pet Grid Component

```typescript
// components/organisms/PetGrid.tsx
'use client';

import { usePets } from '@/hooks/usePets';
import { PetCard } from '@/components/molecules/PetCard';
import { useState } from 'react';

interface PetGridProps {
  filters: PetFilters;
}

export function PetGrid({ filters }: PetGridProps) {
  const { data, isLoading, error } = usePets(filters);

  if (isLoading) return <PetGridSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.data.map(pet => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
```

#### Search Bar Component

```typescript
// components/molecules/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 300);
  const { data: suggestions } = useSearchSuggestions(debouncedQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pets, colors, avatars..."
      />
      {/* Suggestions dropdown */}
    </form>
  );
}
```

### 6.2 State Management Example

#### React Query Setup

```typescript
// lib/api.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// hooks/usePets.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function usePets(filters: PetFilters) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: () => api.getPets(filters),
  })
}
```

### 6.3 Image Optimization

#### Next.js Image Component Usage

```typescript
// components/molecules/PetCard.tsx
import Image from 'next/image';

// Helper function to get image path
// Note: colorName should match the JSON color name (with spaces if applicable)
function getImagePath(petSlug: string, colorName: string, gender: 'male' | 'female' = 'female') {
  return `/neopets/art/${petSlug}/${gender}/${colorName}.png`;
}

export function PetCard({ pet, color, gender = 'female' }: {
  pet: Pet;
  color: Color;
  gender?: 'male' | 'female';
}) {
  const imagePath = getImagePath(pet.slug, color.slug, gender);

  return (
    <div className="relative aspect-square">
      <Image
        src={imagePath}
        alt={`${pet.name} ${color.name} (${gender})`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );
}

// For color gallery showing both genders
export function ColorCard({ pet, color }: { pet: Pet; color: Color }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Image
        src={getImagePath(pet.slug, color.slug, 'female')}
        alt={`${pet.name} ${color.name} (female)`}
        width={200}
        height={200}
        className="rounded"
      />
      <Image
        src={getImagePath(pet.slug, color.slug, 'male')}
        alt={`${pet.name} ${color.name} (male)`}
        width={200}
        height={200}
        className="rounded"
      />
    </div>
  );
}
```

---

## 7. Backend Implementation Details

### 7.1 Service Layer Example

```typescript
// services/petService.ts
import { prisma } from '@/lib/database'
import { Redis } from '@/lib/redis'
import type { PetFilters } from '@/types'

export class PetService {
  async getPets(filters: PetFilters) {
    // Check cache first
    const cacheKey = `pets:list:${JSON.stringify(filters)}`
    const cached = await Redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    // Query database
    const where = this.buildWhereClause(filters)
    const [pets, total] = await Promise.all([
      prisma.petSpecies.findMany({
        where,
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
        orderBy: this.buildOrderBy(filters),
      }),
      prisma.petSpecies.count({ where }),
    ])

    const result = { data: pets, meta: { total, ...filters } }

    // Cache result
    await Redis.setex(cacheKey, 300, JSON.stringify(result))

    return result
  }

  private buildWhereClause(filters: PetFilters) {
    return {
      ...(filters.category && { category: filters.category }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { tags: { has: filters.search } },
        ],
      }),
    }
  }
}
```

### 7.2 Error Handling

```typescript
// middleware/errorHandler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500

  logger.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  })

  return reply.status(statusCode).send({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message,
    },
  })
}
```

### 7.3 Rate Limiting

```typescript
// middleware/rateLimit.ts
import { Redis } from '@/lib/redis'

export async function rateLimit(
  request: FastifyRequest,
  reply: FastifyReply,
  limit: number = 100,
  window: number = 60
) {
  const ip = request.ip
  const key = `rate_limit:${ip}:${request.url}`

  const count = await Redis.incr(key)
  if (count === 1) {
    await Redis.expire(key, window)
  }

  if (count > limit) {
    return reply.status(429).send({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Limit: ${limit} per ${window}s`,
      },
    })
  }
}
```

---

## 8. Data Import & Image Management

### 8.1 Image Path Resolution

```typescript
// lib/imagePaths.ts
/**
 * Centralized image path management
 */

export function getNeopetImagePath(
  petSlug: string,
  colorName: string,
  gender: 'male' | 'female' = 'female'
): string {
  // IMPORTANT: File names match JSON color names exactly (with spaces)
  // Example: "oil paint.png", "polka dot.png", "swamp gas.png"
  // So we use the color name as-is, not as a slug

  return `/neopets/art/${petSlug}/${gender}/${colorName}.png`
}

/**
 * Verify image exists in file system
 */
export async function imageExists(imagePath: string): Promise<boolean> {
  const fs = require('fs').promises
  const path = require('path')

  // Remove leading slash and resolve from project root
  const fullPath = path.join(process.cwd(), 'public', imagePath)

  try {
    await fs.access(fullPath)
    return true
  } catch {
    return false
  }
}
```

### 8.2 Data Import Script

```typescript
// scripts/import-pets.ts
/**
 * Import pet data from JSON files into database
 * Maps JSON structure to database schema with image paths
 */

import { prisma } from '@/lib/database'
import { getColorImagePaths } from '@/lib/imagePaths'
import fs from 'fs/promises'
import path from 'path'

async function importPetData() {
  const dataDir = path.join(process.cwd(), 'data')
  const files = await fs.readdir(dataDir)
  const petFiles = files.filter(
    (f) => f.endsWith('.json') && f !== 'allPets.json' && f !== 'codes.json'
  )

  for (const file of petFiles) {
    const petName = path.basename(file, '.json')
    const filePath = path.join(dataDir, file)
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'))

    // Create pet species
    const pet = await prisma.petSpecies.upsert({
      where: { slug: petName },
      update: {},
      create: {
        name: petName.charAt(0).toUpperCase() + petName.slice(1),
        slug: petName,
        imagePath: getColorImagePaths(petName, 'blue').female, // Default image
        totalColors: Object.keys(data).length,
      },
    })

    // Create colors
    for (const [colorName, colorData] of Object.entries(data)) {
      const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-')
      const paths = getColorImagePaths(petName, colorName)

      await prisma.color.upsert({
        where: {
          petSpeciesId_slug: {
            petSpeciesId: pet.id,
            slug: colorSlug,
          },
        },
        update: {},
        create: {
          petSpeciesId: pet.id,
          name: colorName,
          slug: colorSlug,
          type: determineColorType(colorName),
          rarity: determineRarity(colorName),
          imagePathFemale: paths.female,
          imagePathMale: paths.male,
          metadata: colorData, // Store original JSON data
          isAvailable: colorData.isAvailable ?? true,
        },
      })
    }
  }
}
```

---

## 9. Infrastructure & Deployment

### 9.1 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  - Next.js Application                  │
│  - Automatic deployments                │
│  - Edge functions for API routes        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Railway/Render (Backend API)       │
│  - Node.js API server                   │
│  - Auto-scaling                         │
│  - Health checks                        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   PostgreSQL Database (Railway/Supabase) │
│  - Managed database                     │
│  - Automatic backups                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Redis (Railway/Upstash)            │
│  - Caching                              │
│  - Rate limiting                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Local Image Assets                     │
│  - Copied to public/neopets/art/       │
│  - Served as static files              │
│  - Optional: CDN caching               │
└─────────────────────────────────────────┘
```

### 9.2 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Image Paths
IMAGE_BASE_PATH=/neopets/art
LOCAL_IMAGE_DIR=data/neopets/art

# API
API_BASE_URL=https://api.neopets-tribute.com
NEXT_PUBLIC_API_URL=https://api.neopets-tribute.com

# Data Import (optional)
DATA_DIR=data

# Auth (if implemented)
JWT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://neopets-tribute.com

# Monitoring
SENTRY_DSN=...
```

### 9.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/setup-pnpm@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm lint
      - run: pnpm type-check

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway-app/railway-action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## 10. Security Considerations

### 10.1 Security Measures

#### Input Validation

- Validate all user inputs
- Use Zod for schema validation
- Sanitize search queries
- Prevent SQL injection (Prisma handles this)

#### Rate Limiting

- API rate limits per IP
- Progressive rate limiting
- Different limits for different endpoints

#### CORS

```typescript
// Backend CORS configuration
app.register(fastifyCors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://neopets-tribute.com'],
  credentials: true,
})
```

#### HTTPS

- Enforce HTTPS everywhere
- HSTS headers
- SSL/TLS certificates (automatic with Vercel)

#### Data Protection

- Encrypt sensitive data
- Hash passwords (if user accounts)
- Secure session storage
- Environment variables for secrets

#### Content Security Policy

```typescript
// Next.js CSP
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      img-src 'self' data: https:;
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
]
```

---

## 11. Performance Optimization

### 11.1 Frontend Optimizations

#### Code Splitting

- Route-based code splitting (automatic with Next.js)
- Component lazy loading
- Dynamic imports for heavy components

#### Image Optimization

- Next.js Image component
- WebP/AVIF formats
- Responsive images
- Lazy loading
- Blur placeholders

#### Caching Strategies

- Static generation for static content
- ISR for semi-static content
- Browser caching headers
- Service worker (optional)

#### Bundle Optimization

- Tree shaking
- Minification
- Compression (gzip/brotli)
- Analyze bundle size

### 11.2 Backend Optimizations

#### Database Optimization

- Proper indexes
- Query optimization
- Connection pooling
- Prepared statements (Prisma)

#### Caching

- Redis caching layers
- API response caching
- Database query caching
- CDN caching

#### API Optimization

- Pagination for large datasets
- Field selection (only return needed fields)
- Compression middleware
- Response streaming for large responses

---

## 12. Monitoring & Logging

### 12.1 Error Tracking

**Sentry Integration**

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### 12.2 Logging

**Structured Logging**

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
        }
      : undefined,
})
```

### 12.3 Monitoring Metrics

- API response times
- Error rates
- Database query performance
- Cache hit rates
- Image load performance
- Uptime monitoring

---

## 13. Testing Strategy

### 13.1 Testing Pyramid

```
        /\
       /  \     E2E Tests (Playwright)
      /____\
     /      \   Integration Tests
    /________\
   /          \  Unit Tests (Vitest)
  /____________\
```

### 13.2 Unit Tests

```typescript
// __tests__/services/petService.test.ts
import { describe, it, expect } from 'vitest'
import { PetService } from '@/services/petService'

describe('PetService', () => {
  it('should fetch pets with filters', async () => {
    const service = new PetService()
    const result = await service.getPets({ page: 1, pageSize: 10 })
    expect(result.data).toHaveLength(10)
  })
})
```

### 13.3 Integration Tests

```typescript
// __tests__/api/pets.test.ts
import { test } from '@playwright/test'

test('GET /api/v1/pets returns pet list', async ({ request }) => {
  const response = await request.get('/api/v1/pets')
  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  expect(data.data).toBeInstanceOf(Array)
})
```

### 13.4 E2E Tests

```typescript
// e2e/pets.spec.ts
import { test, expect } from '@playwright/test'

test('user can browse pets', async ({ page }) => {
  await page.goto('/pets')
  await expect(page.locator('h1')).toContainText('Pets')
  await page.click('[data-testid="pet-card"]:first-child')
  await expect(page).toHaveURL(/\/pets\/\w+/)
})
```

---

## 14. Development Workflow

### 14.1 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/username/neopets-tribute.git
cd neopets-tribute

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Setup database
pnpm prisma migrate dev
pnpm prisma generate

# 5. Setup Redis (Docker)
docker run -d -p 6379:6379 redis:7-alpine

# 6. Copy images to public directory (or use symlink)
# Option A: Copy during build
pnpm copy-images

# Option B: Create symlink (on Unix/Mac)
# ln -s data/neopets/art public/neopets/art

# 7. Run development servers
pnpm dev              # Frontend (Next.js)
pnpm dev:api          # Backend API
```

### 14.2 Git Workflow

```
main (production)
  │
  ├── develop (integration)
  │   │
  │   ├── feature/pet-browser
  │   ├── feature/color-gallery
  │   └── feature/avatar-gallery
  │
  └── hotfix/...
```

**Branch Naming**:

- `feature/feature-name`
- `fix/bug-description`
- `refactor/component-name`
- `docs/documentation-update`

### 14.3 Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Pre-commit hooks (Husky)
- Conventional commits
- Code reviews required

---

## 15. Migration & Deployment Plan

### 15.1 Phase 1: Infrastructure Setup

1. Set up GitHub repository
2. Configure CI/CD pipelines
3. Set up hosting accounts (Vercel, Railway)
4. Create databases (PostgreSQL, Redis)
5. Configure monitoring (Sentry)
6. Set up image serving (copy to public/ or API route)

### 15.2 Phase 2: Core Development

1. Set up project structure
2. Database schema design and migration
3. Image path utilities and helpers
4. Data import scripts (from JSON files)
5. Basic API endpoints
6. Basic frontend pages

### 15.3 Phase 3: Content Population

1. Import pet data from JSON files to database
2. Map image paths to database records
3. Validate all images exist
4. Database population complete
5. Image serving verified

### 15.4 Phase 4: Feature Development

1. Implement core features iteratively
2. Testing and bug fixes
3. Performance optimization
4. Security hardening

### 15.5 Phase 5: Launch

1. Final testing
2. Performance audit
3. Security audit
4. Documentation
5. Soft launch (beta)
6. Public launch

---

## 16. Future Considerations

### 16.1 Scalability Improvements

- Move to microservices architecture if needed
- Implement CDN for API responses
- Database read replicas
- Horizontal scaling for API
- Image optimization pipeline (if needed for faster loads)

### 16.2 Feature Enhancements

- Real-time updates (WebSockets)
- User authentication and accounts
- Advanced analytics
- Machine learning recommendations
- Mobile app (React Native)

### 16.3 Technical Debt

- Migrate to newer frameworks as they mature
- Optimize database queries based on usage
- Optimize image delivery (CDN, compression)
- Enhance monitoring and alerting

---

## 17. Appendix

### 17.1 Technology Versions

- Node.js: 20.x LTS
- Next.js: 14.x
- React: 18.x
- TypeScript: 5.x
- PostgreSQL: 15+
- Redis: 7+

### 17.2 Useful Resources

- Next.js Documentation: https://nextjs.org/docs
- Next.js Image Optimization: https://nextjs.org/docs/pages/api-reference/components/image
- Prisma Documentation: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs

### 17.3 Estimated Costs (Monthly)

**Small Scale (1K users/day)**:

- Vercel Pro: $20 (includes image hosting)
- Railway (Backend): $5-10
- Railway (Database): $5
- Railway (Redis): $5
- **Total**: ~$35-40/month (no external image storage needed!)

**Medium Scale (10K users/day)**:

- Vercel Pro: $20 (includes image hosting)
- Railway (Backend): $20-30
- Railway (Database): $20
- Railway (Redis): $10
- Optional: CloudFlare CDN: $0-10
- **Total**: ~$70-90/month (significant savings without external storage)

---

## Conclusion

This Technical Requirements Document provides a comprehensive blueprint for building the Neopets tribute website. The architecture is designed to be scalable, maintainable, and performant, while the technology stack offers modern tools and excellent developer experience.

**Key Strengths**:

- Modern, proven technology stack
- Scalable architecture
- **Local image storage** - All 7,000+ images already available
- **Cost-effective** - No external image storage costs
- **Fast & reliable** - Direct file access, no external dependencies
- Performance-focused design
- Security considerations
- Developer-friendly workflow

**Next Steps**:

1. Review and approve this TRD
2. Set up development environment
3. Begin Phase 1 implementation
4. Create detailed task breakdown
5. Start development sprint

---

**Document Version**: 1.0  
**Last Updated**: [Date]  
**Authors**: Development Team
