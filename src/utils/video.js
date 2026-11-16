// YouTube recording URLs (videos and playlists) -> privacy-enhanced embed URL; anything else -> null
const YOUTUBE_ID = /^[\w-]{11}$/
const PLAYLIST_ID = /^[\w-]{13,}$/
const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/'

const youtubeId = (url) => {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, '')
  let id = null
  if (host === 'youtu.be') {
    id = parsed.pathname.split('/')[1]
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, kind, value] = parsed.pathname.split('/')
    if (kind === 'watch') id = parsed.searchParams.get('v')
    else if (['embed', 'shorts', 'live'].includes(kind)) id = value
  }
  return id && YOUTUBE_ID.test(id) ? id : null
}

const youtubePlaylistId = (url) => {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, '')
  if (host !== 'youtube.com' || parsed.pathname !== '/playlist') return null
  const list = parsed.searchParams.get('list')
  return list && PLAYLIST_ID.test(list) ? list : null
}

const youtubeEmbedUrl = (url) => {
  const id = youtubeId(url || '')
  if (id) return `${EMBED_BASE}${id}`
  const list = youtubePlaylistId(url || '')
  return list ? `${EMBED_BASE}videoseries?list=${list}` : null
}

module.exports = { youtubeId, youtubePlaylistId, youtubeEmbedUrl }
