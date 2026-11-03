// CJS so the node test runner can require it

/**
 * The newest items released up to a cutoff. Items must already be sorted
 * newest first. The cutoff is the build time (site.buildTime), not the
 * browser clock, so the static HTML and the hydrated page pick the same items.
 * @param {Array} nodes - Kontent nodes sorted by date, newest first
 * @param {Function} getDate - node => ISO date string (or empty)
 * @param {String|Date} cutoff - build time
 * @param {Number} count
 * @returns {Array}
 */
const latestReleased = (nodes, getDate, cutoff, count) => {
  const limit = new Date(cutoff)
  return nodes
    .filter((node) => {
      const date = getDate(node)
      return !date || new Date(date) <= limit
    })
    .slice(0, count)
}

module.exports = { latestReleased }
