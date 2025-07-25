function combineLists(list1, list2) {
  // Merge and sort by left_position
  const merged = [...list1, ...list2].sort((a, b) => a.positions[0] - b.positions[0]);
  const result = [];

  for (let i = 0; i < merged.length; i++) {
    let current = merged[i];
    let mergedFlag = false;
    for (let j = 0; j < result.length; j++) {
      let prev = result[j];
      // Check overlap
      let overlap = Math.min(current.positions[1], prev.positions[1]) - Math.max(current.positions[0], prev.positions[0]);
      let lenCurrent = current.positions[1] - current.positions[0];
      let lenPrev = prev.positions[1] - prev.positions[0];
      if (overlap > 0 && (overlap > lenCurrent / 2 || overlap > lenPrev / 2)) {
        // Merge values, keep the earlier position
        prev.values = prev.values.concat(current.values);
        mergedFlag = true;
        break;
      }
    }
    if (!mergedFlag) {
      result.push({ ...current });
    }
  }
  return result;
}

module.exports = { combineLists }; 