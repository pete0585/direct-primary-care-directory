import { existsSync, readdirSync } from 'fs'
import { join } from 'path'

export const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.directprimarycarefinder.com'

/** Folders under `app/dpc-doctors` that have a `page.tsx`. */
export function getCityPageFolders(): string[] {
  const dir = join(process.cwd(), 'app', 'dpc-doctors')
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && existsSync(join(dir, entry.name, 'page.tsx'))
    )
    .map((entry) => entry.name)
    .sort()
}
