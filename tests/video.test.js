const { test } = require('node:test')
const assert = require('node:assert/strict')
const { youtubeEmbedUrl } = require('../src/utils/video')

const EMBED = 'https://www.youtube-nocookie.com/embed/0TcuEyjwlQE'

test('watch, short-link, shorts, live and embed URLs map to the embed URL', () => {
  for (const url of [
    'https://www.youtube.com/watch?v=0TcuEyjwlQE',
    'https://youtube.com/watch?v=0TcuEyjwlQE&t=42s',
    'https://m.youtube.com/watch?v=0TcuEyjwlQE',
    'https://youtu.be/0TcuEyjwlQE?si=abc',
    'https://youtube.com/shorts/0TcuEyjwlQE',
    'https://www.youtube.com/live/0TcuEyjwlQE',
    'https://www.youtube.com/embed/0TcuEyjwlQE',
  ]) {
    assert.equal(youtubeEmbedUrl(url), EMBED, url)
  }
})

test('non-YouTube or malformed recordings get no embed', () => {
  for (const url of [
    '',
    undefined,
    'not a url',
    'https://vimeo.com/123456',
    'https://www.youtube.com/playlist',
    'https://www.youtube.com/playlist?list=x',
    'https://evil.example/playlist?list=PLZ9F0R17Zg3NafacHVuYqghN3ikNMgoMs',
    'https://www.youtube.com/watch?v=short',
    'https://evil.example/watch?v=0TcuEyjwlQE',
  ]) {
    assert.equal(youtubeEmbedUrl(url), null, String(url))
  }
})

test('playlist URLs map to the videoseries embed URL', () => {
  for (const url of [
    'https://youtube.com/playlist?list=PLZ9F0R17Zg3NafacHVuYqghN3ikNMgoMs',
    'https://www.youtube.com/playlist?list=PLZ9F0R17Zg3NafacHVuYqghN3ikNMgoMs&si=abc',
  ]) {
    assert.equal(
      youtubeEmbedUrl(url),
      'https://www.youtube-nocookie.com/embed/videoseries?list=PLZ9F0R17Zg3NafacHVuYqghN3ikNMgoMs',
      url
    )
  }
})
