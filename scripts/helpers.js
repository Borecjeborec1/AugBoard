function closest(arr, x, ind) {
  if (ind === 4 || ind === 0) return { index: ind }
  return arr.sort((a, b) => Math.abs(x - a.x) - Math.abs(x - b.x))[0];
}

function colorDiff(color1, color2) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

function averagePos(positions, ind, based) {
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < positions.length; i++) {
    sumX += positions[i].x;
    sumY += positions[i].y;
  }
  if (based.length) {
    return { x: sumX / positions.length, y: sumY / positions.length, isDown: true, index: closest(based, sumX / positions.length, ind).index };
  }
  return { x: sumX / positions.length, y: sumY / positions.length, isDown: true, index: ind };
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
      if (finger.length < 30)
        finger.push(xs[i])
      else {
        if (finger.length > threshold)
          fingers.push(finger)
        finger = []
      }
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

function isNearY(pos1, pos2, threshold) {
  if (!pos1 || !pos2) return false
  return Math.abs(pos1.y - pos2.y) < threshold
}

function isNearX(pos1, pos2, threshold) {
  if (!pos1 || !pos2) return false
  return Math.abs(pos1.x - pos2.x) < threshold
}

function isNear(pos1, pos2, threshold) {
  if (!pos1 || !pos2) return false
  return Math.abs(pos1.x - pos2.x) < threshold && Math.abs(pos1.y - pos2.y) < threshold
}

function getKey(pos, jKey, switchWidth) {
  let resKey = "Did not find a key"
  if (pos.x > jKey.x - (switchWidth / 2) - 2 * switchWidth && pos.x < jKey.x + (switchWidth / 2) - 2 * switchWidth)
    resKey = ("L")
  else if (pos.x > jKey.x - (switchWidth / 2) - switchWidth && pos.x < jKey.x + (switchWidth / 2) - switchWidth)
    resKey = ("K")
  else if (pos.x > jKey.x - (switchWidth / 2) && pos.x < jKey.x + (switchWidth / 2))
    resKey = ("J")
  else if (pos.x > jKey.x - (switchWidth / 2) + switchWidth && pos.x < jKey.x + (switchWidth / 2) + switchWidth)
    resKey = ("H")
  else if (pos.x > jKey.x - (switchWidth / 2) + 2 * switchWidth && pos.x < jKey.x + (switchWidth / 2) + 2 * switchWidth)
    resKey = ("G")
  else if (pos.x > jKey.x - (switchWidth / 2) + 3 * switchWidth && pos.x < jKey.x + (switchWidth / 2) + 3 * switchWidth)
    resKey = ("F")
  else if (pos.x > jKey.x - (switchWidth / 2) + 4 * switchWidth && pos.x < jKey.x + (switchWidth / 2) + 4 * switchWidth)
    resKey = ("D")
  else if (pos.x > jKey.x - (switchWidth / 2) + 5 * switchWidth && pos.x < jKey.x + (switchWidth / 2) + 5 * switchWidth)
    resKey = ("S")
  else if (pos.x > jKey.x - (switchWidth / 2) + 6 * switchWidth && pos.x < jKey.x + (switchWidth / 2) + 6 * switchWidth)
    resKey = ("A")

  return resKey

}