// Regenerates the "Project websites" list in index.html: every Simply007 repo
// with GitHub Pages that is served under this domain (chrastina.dev/<repo>/).
// Run by .github/workflows/update-projects.yml weekly; locally:
//   GITHUB_TOKEN=$(gh auth token) node scripts/update-projects.mjs
import { readFile, writeFile } from 'node:fs/promises'

const OWNER = 'Simply007'
const ORIGIN = 'https://chrastina.dev'
const USER_SITE = `${OWNER}.github.io`
const START = '<!-- projects:start -->'
const END = '<!-- projects:end -->'

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'chrastina.dev-update-projects',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
}

const escapeHtml = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  )

const fetchRepos = async () => {
  const repos = []
  for (let page = 1; ; page++) {
    const res = await fetch(
      `https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`,
      { headers }
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
    const batch = await res.json()
    repos.push(...batch)
    if (batch.length < 100) return repos
  }
}

// The Pages API needs access to each repo, which the workflow token does not
// have. A repo served on this domain answers 200 at ORIGIN/<repo>/; one with
// its own custom domain answers with a redirect to it.
const servedHere = async (name) => {
  const res = await fetch(`${ORIGIN}/${name}/`, { redirect: 'manual' })
  return res.status === 200
}

const renderItem = (repo) => {
  const tags = [
    repo.fork && '<span class="tag">Fork</span>',
    repo.archived && '<span class="tag">Archived</span>',
  ]
    .filter(Boolean)
    .join('')
  const text = repo.description?.trim()
    ? `\n              <span class="project-text">${escapeHtml(repo.description.trim())}</span>`
    : ''
  return [
    '          <li>',
    `            <a class="project" href="${ORIGIN}/${repo.name}/">`,
    `              <span class="project-name">${escapeHtml(repo.name)}${tags}</span>${text}`,
    '            </a>',
    '          </li>',
  ].join('\n')
}

const updateJsonLd = (html, projects) =>
  html.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
    (_, open, json, close) => {
      const data = JSON.parse(json)
      const list = data['@graph'].find((n) => n['@type'] === 'WebPage')
        .mainEntity
      // sites off this domain (main website, dev-relations.com) stay first
      const fixed = list.itemListElement.filter(
        (i) => !i.url.startsWith(`${ORIGIN}/`) || i.url === `${ORIGIN}/`
      )
      list.itemListElement = [
        ...fixed.map(({ url, name }) => ({ url, name })),
        ...projects.map((r) => ({ url: `${ORIGIN}/${r.name}/`, name: r.name })),
      ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item }))
      const body = JSON.stringify(data, null, 2).replace(/^/gm, '      ')
      return `${open}\n${body}\n    ${close}`
    }
  )

const main = async () => {
  const exclude = new Set(
    JSON.parse(await readFile('projects-exclude.json', 'utf8')).map((n) =>
      n.toLowerCase()
    )
  )
  const candidates = (await fetchRepos()).filter(
    (r) =>
      r.has_pages && r.name !== USER_SITE && !exclude.has(r.name.toLowerCase())
  )
  const checks = await Promise.all(candidates.map((r) => servedHere(r.name)))
  const projects = candidates
    .filter((_, i) => checks[i])
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))

  // an API hiccup must not wipe the published list
  if (!projects.length) throw new Error('No project sites found, not writing')

  const html = await readFile('index.html', 'utf8')
  const start = html.indexOf(START)
  const end = html.indexOf(END)
  if (start < 0 || end < start) throw new Error('Project list markers missing')
  const list = `${START}\n${projects.map(renderItem).join('\n')}\n          `
  const next = updateJsonLd(
    html.slice(0, start) + list + html.slice(end),
    projects
  )

  if (next === html) {
    console.log(`No change, ${projects.length} project sites`)
    return
  }
  await writeFile('index.html', next)
  const today = new Date().toISOString().slice(0, 10)
  const sitemap = await readFile('sitemap.xml', 'utf8')
  await writeFile(
    'sitemap.xml',
    sitemap.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`)
  )
  console.log(`Updated, ${projects.length} project sites:`)
  for (const r of projects) console.log(`  ${r.name}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
