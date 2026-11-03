// CJS so the node test runner can require it
const CATEGORY_PARAM = 'categories'

/**
 * Read selected category codenames from a query string
 * @param {String} search - location.search, e.g. "?categories=ai,ckeditor"
 * @returns {Set<String>}
 */
const parseCategories = (search) => {
  const value = new URLSearchParams(search || '').get(CATEGORY_PARAM)
  if (!value) return new Set()
  return new Set(
    value
      .split(',')
      .map((codename) => codename.trim())
      .filter(Boolean)
  )
}

/**
 * Write selected category codenames into a query string, keeping other params
 * @param {String} search - current location.search
 * @param {Set<String>} selectedCategories
 * @returns {String} query string with a leading "?", or "" when empty
 */
const buildSearch = (search, selectedCategories) => {
  const params = new URLSearchParams(search || '')
  if (selectedCategories.size > 0) {
    params.set(CATEGORY_PARAM, [...selectedCategories].join(','))
  } else {
    params.delete(CATEGORY_PARAM)
  }
  // keep the comma readable instead of %2C
  const query = params.toString().replace(/%2C/g, ',')
  return query ? `?${query}` : ''
}

module.exports = { CATEGORY_PARAM, parseCategories, buildSearch }
