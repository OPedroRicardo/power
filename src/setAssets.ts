import { mkdir } from 'fs/promises'

export default async function setAssets () {
  const base = `${process.cwd()}/assets/`

  const opts = { recursive: true }

  const reqs = ['/analytics/view', '/audios/gifts', '/audios/users', '/json']
    .map(path => mkdir(base + path, opts))

  await Promise.all(reqs)
}