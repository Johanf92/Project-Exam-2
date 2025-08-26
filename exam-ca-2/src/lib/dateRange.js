export function overlaps(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  // overlap for half-open ranges [start, end)
  return aS < bE && bS < aE;
}
