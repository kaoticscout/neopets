# Deployment Guide - GitHub Pages

This project is now configured for static deployment to GitHub Pages. All API routes have been replaced with client-side data fetching.

## What Changed

### ✅ Completed Changes

1. **Data Files Moved to Public Directory**
   - All JSON data files copied from `data/` to `public/data/`
   - Data is now accessible via static file serving

2. **Client-Side Data Service**
   - Created `lib/data-client.ts` - fetches JSON files directly from `public/data/`
   - Replaces server-side `lib/data.ts` for static export

3. **Hooks Updated**
   - `hooks/usePets.ts` - Now uses `lib/data-client.ts` instead of API routes
   - `hooks/useStats.ts` - Now uses `lib/data-client.ts` instead of API routes

4. **Next.js Configuration**
   - `next.config.mjs` - Added `output: 'export'` for static export
   - Images set to `unoptimized: true` (required for static export)

5. **GitHub Actions Workflow**
   - `.github/workflows/deploy.yml` - Automated deployment workflow

## How to Deploy

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Save the settings

### Step 2: Push to Main Branch

The workflow will automatically:

- Build the Next.js static export
- Deploy to GitHub Pages
- Make your site available at `https://<username>.github.io/<repository-name>`

### Step 3: Verify Deployment

After pushing to `main` or `master`:

1. Check the **Actions** tab in your repository
2. Wait for the workflow to complete (usually 2-5 minutes)
3. Visit your GitHub Pages URL

## Manual Testing

To test the static export locally:

```bash
npm run build
```

This creates a `out/` directory with all static files. You can test it with any static file server:

```bash
# Using Python
python -m http.server 8000 -d out

# Using Node.js (npx serve)
npx serve out
```

Visit `http://localhost:8000` to verify everything works.

## Architecture

### Static Export Architecture

```
┌─────────────────┐
│  GitHub Pages   │
│  (Static Files) │
└────────┬────────┘
         │
         ├─── index.html
         ├─── _next/static/
         ├─── data/*.json
         └─── neopets/art/**/*.png
```

### Data Flow

```
User Browser
    ↓
React Component
    ↓
usePets/useStats Hook
    ↓
lib/data-client.ts
    ↓
fetch('/data/pet.json')
    ↓
public/data/pet.json (Static File)
```

## Important Notes

1. **No API Routes**: API routes (`app/api/*`) are not included in static export. They're kept for local development but won't be available in production.

2. **Client-Side Only**: All data fetching happens in the browser. This means:
   - Initial page load fetches JSON files
   - Data is cached by React Query
   - No server-side rendering of data

3. **File Size**: The `out/` directory will be large (~100MB+) due to all the images. This is fine for GitHub Pages, but initial load times may be slower.

4. **GitHub Pages Limits**:
   - Repository size: 1GB recommended
   - File size: 100MB per file
   - Bandwidth: 100GB/month for free tier

## Troubleshooting

### Build Fails

- Check that all JSON files are in `public/data/`
- Verify `next.config.mjs` has `output: 'export'`
- Check for any server-only imports (like `fs`, `path` in client components)

### Images Not Loading

- Ensure images are in `public/neopets/art/`
- Check image paths in `lib/imagePaths.ts`
- Verify image file names match JSON color names exactly

### Deployment Not Triggering

- Check that workflow file is in `.github/workflows/deploy.yml`
- Verify branch name is `main` or `master`
- Check Actions tab for workflow runs

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file in `public/CNAME` with your domain:

   ```
   example.com
   ```

2. Configure DNS records as per [GitHub Pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

3. Push the changes and wait for DNS propagation

## Future Improvements

- [ ] Add data compression/minification
- [ ] Implement service worker for offline support
- [ ] Add CDN support for faster image loading
- [ ] Optimize image sizes/lazy loading
