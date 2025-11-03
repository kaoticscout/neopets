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

// Generate static params for all pet slugs (required for static export)
// IMPORTANT: This runs ONLY at BUILD TIME to generate static HTML files
// After the build, the site is 100% client-side - everything runs in the browser
// This is just Next.js's way of knowing which pages to pre-generate
export async function generateStaticParams() {
  return KNOWN_PET_SLUGS.map((slug) => ({
    slug,
  }))
}

// Layout component - server component that wraps the client page
// The layout is server-side ONLY for generateStaticParams() - the page itself is client-side
export default function PetSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
