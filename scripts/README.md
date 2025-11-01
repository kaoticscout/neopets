# Download Neopets Images Script

This script downloads all Neopet images from Neopets.com and organizes them in a structured directory.

## Usage

```bash
npm run download-images
```

Or directly:

```bash
node scripts/download-neopets.js
```

## What it does

1. Reads all pet JSON files from `/data` directory
2. Extracts pet species, paint colors, and gender IDs
3. Downloads images from `https://pets.neopets.com/cp/{ID}/1/4.png`
4. Organizes files in: `/data/neopets/art/{pet_name}/{gender}/{paint_name}.png`

## Features

- ✅ **Rate limiting**: 2 seconds between requests (respectful to Neopets servers)
- ✅ **Resume capability**: Skips files that already exist
- ✅ **Error handling**: Retries failed downloads (up to 3 times)
- ✅ **Progress tracking**: Shows progress for each pet and overall
- ✅ **Statistics**: Detailed download stats at the end

## Output Structure

```
data/
└── neopets/
    └── art/
        ├── acara/
        │   ├── female/
        │   │   ├── blue.png
        │   │   ├── red.png
        │   │   └── ...
        │   └── male/
        │       ├── blue.png
        │       ├── red.png
        │       └── ...
        ├── aisha/
        └── ...
```

## Configuration

You can adjust the following constants in the script:

- `RATE_LIMIT_MS`: Delay between requests (default: 2000ms)
- `MAX_RETRIES`: Number of retries for failed downloads (default: 3)
- `RETRY_DELAY_MS`: Delay before retrying (default: 5000ms)

## Estimated Time

With ~55 pet species and ~70 colors per pet (with male/female variants):

- Total images: ~7,700 images
- At 2 seconds per image: ~4.3 hours

The script will skip already downloaded images, so you can safely interrupt and resume.

## Notes

- The script respects Neopets servers with rate limiting
- Files are organized by pet species, then gender, then paint color
- Failed downloads are logged but don't stop the script
- The script creates directories automatically as needed
