// YouTube recording URLs -> privacy-enhanced embed URL; anything else -> null
const YOUTUBE_ID = /^[\w-]{11}$/

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

const youtubeEmbedUrl = (url) => {
  const id = youtubeId(url || '')
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

module.exports = { youtubeId, youtubeEmbedUrl }
