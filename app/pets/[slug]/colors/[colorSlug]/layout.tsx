// This layout generates static params for all pet+color combinations
// It runs at BUILD TIME ONLY - after build, everything is client-side

// Known list of pet slugs - matches lib/data-client.ts
const KNOWN_PET_SLUGS = [
  'acara',
  'aisha',
  'blumaroo',
  'bori',
  'bruce',
  'buzz',
  'chia',
  'chomby',
  'cybunny',
  'draik',
  'elephante',
  'eyrie',
  'flotsam',
  'gelert',
  'gnorbu',
  'grarrl',
  'grundo',
  'hissi',
  'ixi',
  'jetsam',
  'jubjub',
  'kacheek',
  'kau',
  'kiko',
  'koi',
  'korbat',
  'kougra',
  'krawk',
  'kyrii',
  'lenny',
  'lupe',
  'lutari',
  'meerca',
  'moehog',
  'mynci',
  'nimmo',
  'ogrin',
  'peophin',
  'poogle',
  'pteri',
  'quiggle',
  'ruki',
  'scorchio',
  'shoyru',
  'skeith',
  'techo',
  'tonu',
  'tuskaninny',
  'uni',
  'usul',
  'vandagyre',
  'wocky',
  'xweetok',
  'yurble',
  'zafara',
]

// Generate static params for all pet+color combinations
// This runs at BUILD TIME ONLY to generate static HTML files
export async function generateStaticParams() {
  const fs = await import('fs')
  const path = await import('path')

  const params: Array<{ slug: string; colorSlug: string }> = []

  for (const petSlug of KNOWN_PET_SLUGS) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', `${petSlug}.json`)

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(fileContent)

        // Generate color slugs from the JSON keys
        for (const colorName of Object.keys(data)) {
          const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-')
          params.push({
            slug: petSlug,
            colorSlug,
          })
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not load colors for ${petSlug}:`, error)
    }
  }

  return params
}

// Layout component - server component that wraps the client page
export default function ColorSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
