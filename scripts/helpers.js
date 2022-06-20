function colorDiff(color1, color2) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

function averagePos(positions) {
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < positions.length; i++) {
    sumX += positions[i].x;
    sumY += positions[i].y;
  }
  return { x: sumX / positions.length, y: sumY / positions.length, isDown: true };
}

function splitFingers(xs, threshold) {
  xs.sort((a, b) => a - b)
  let fingers = []
  let finger = []
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] + 1 !== xs[i + 1]) {
      if (finger.length > threshold)
        fingers.push(finger)
      finger = []
    } else {
      finger.push(xs[i])
    }
  }
  return fingers
}

function filterLocs(xLocs, locs) {
  let filteredLocs = []
  for (let i = 0; i < xLocs.length; i++) {
    let filtered = locs.filter((loc) => xLocs[i].includes(loc.x))
    filteredLocs.push(filtered)
  }
  return filteredLocs
}

function isNear(pos1, pos2, threshold) {
  if (!pos1 || !pos2) return false
  return Math.abs(pos1.x - pos2.x) < threshold && Math.abs(pos1.y - pos2.y) < threshold
}