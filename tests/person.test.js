const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buildPerson, PERSON_ID } = require('../src/utils/seo')

const keyword = (value) => ({ elements: { keyword: { value } } })

const layout = (overrides = {}) => ({
  person_name: { value: 'Ondřej Chrastina' },
  person_job_title: { value: 'Developer Advocate' },
  person_description: { value: 'Developer Relations consultant.' },
  person_photo: { value: [{ url: 'https://assets.example/photo.png' }] },
  person_affiliation: {
    value: [
      {
        elements: {
          text: { value: 'CKEditor' },
          url: { value: 'https://ckeditor.com' },
        },
      },
    ],
  },
  person_address_locality: { value: 'Brno' },
  person_address_country: { value: 'CZ' },
  person_knows_about: { value: [keyword('CKEditor'), keyword('Drupal')] },
  ...overrides,
})

const github = {
  elements: {
    account_handle: { value: 'Simply007' },
    social_media_type: {
      value: [
        { elements: { account_pattern: { value: 'https://github.com/%s' } } },
      ],
    },
  },
}

test('builds the Person node from the CMS values only', () => {
  assert.deepEqual(buildPerson(layout(), [github], 'https://site.example'), {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Ondřej Chrastina',
    url: 'https://site.example/',
    image: 'https://assets.example/photo.png',
    jobTitle: 'Developer Advocate',
    description: 'Developer Relations consultant.',
    affiliation: {
      '@type': 'Organization',
      name: 'CKEditor',
      url: 'https://ckeditor.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brno',
      addressCountry: 'CZ',
    },
    knowsAbout: ['CKEditor', 'Drupal'],
    sameAs: ['https://github.com/Simply007'],
  })
})

for (const codename of [
  'person_name',
  'person_job_title',
  'person_description',
  'person_photo',
  'person_affiliation',
]) {
  test(`fails the build when ${codename} is empty`, () => {
    const empty =
      codename === 'person_photo' || codename === 'person_affiliation'
        ? []
        : '  '
    assert.throws(
      () => buildPerson(layout({ [codename]: { value: empty } }), []),
      new RegExp(`missing Person fields: ${codename}`)
    )
  })
}

test('fails the build when the Person group is not in the query', () => {
  assert.throws(() => buildPerson({}, []), /person_name, person_job_title/)
})

test('leaves out the optional fields when they are empty', () => {
  const person = buildPerson(
    layout({
      person_address_locality: { value: '' },
      person_address_country: { value: '' },
      person_knows_about: { value: [] },
    }),
    []
  )
  for (const key of ['address', 'knowsAbout', 'sameAs']) {
    assert.equal(key in person, false, key)
  }
})

test('an address with only the country keeps the country', () => {
  const person = buildPerson(
    layout({ person_address_locality: { value: '' } }),
    []
  )
  assert.deepEqual(person.address, {
    '@type': 'PostalAddress',
    addressCountry: 'CZ',
  })
})
