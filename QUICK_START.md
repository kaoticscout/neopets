# Quick Start Guide

## Running the Application

1. **Copy images to public directory** (if not already done):

```bash
npm run copy-images
```

2. **Start development server**:

```bash
npm run dev
```

3. **Open browser**:
   Visit http://localhost:3000

## Available Routes

- `/` - Homepage with stats
- `/pets` - Browse all pets
- `/pets/[slug]` - View specific pet and all colors
- `/pets/[slug]/colors/[colorSlug]` - View specific color

## Features

### Homepage

- Displays total count of pets, colors, and images
- Links to browse pets
- Nostalgic design

### Pet Browser

- Grid view of all 55+ pets
- Search functionality
- Click any pet to see details

### Pet Detail

- Large image of the pet
- All available colors displayed in a grid
- Click any color to see detail

### Color Detail

- Large image with gender toggle (male/female)
- Side-by-side view of both genders
- Navigation breadcrumbs

## Troubleshooting

If images don't load:

1. Make sure you've run `npm run copy-images`
2. Check that images exist in `public/neopets/art/`
3. Verify image paths match the structure: `{pet}/{gender}/{color}.png`

If module resolution errors:

1. Check that all files exist in the expected locations
2. Verify `tsconfig.json` path aliases are correct
3. Try deleting `.next` folder and rebuilding
