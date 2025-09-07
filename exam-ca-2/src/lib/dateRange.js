/**
 * @file Date utility — check if two date ranges overlap.
 */

/**
 * Check whether two half-open date ranges overlap.
 * Ranges are treated as `[start, end)`, meaning the start is inclusive
 * and the end is exclusive.
 *
 * @function overlaps
 * @param {string|Date} aStart - Start of the first range.
 * @param {string|Date} aEnd - End of the first range.
 * @param {string|Date} bStart - Start of the second range.
 * @param {string|Date} bEnd - End of the second range.
 * @returns {boolean} `true` if the ranges overlap, otherwise `false`.
 *
 */

export function overlaps(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE;
}
