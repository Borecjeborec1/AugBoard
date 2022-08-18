function closest(arr, x, ind) {
  if (ind === 4 || ind === 0) return { index: ind }
  return arr.sort((a, b) => Math.abs(x - a.x) - Math.abs(x - b.x))[0];
}

function colorDiff(color1, color2) {
  // return Math.sqrt(
  //   Math.pow(color1[0] - color2[0], 2) +
  //   Math.pow(color1[1] - color2[1], 2) +
  //   Math.pow(color1[2] - color2[2], 2)
  // );
  return (Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2))
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

function mapKeyboard(based) {
  let kb = {}
  if (based.length == 3) {
    kb["l"] = { x: based[0].x, y: based[0].y }
    kb["k"] = { x: based[1].x, y: based[1].y }
    kb["j"] = { x: based[2].x, y: based[2].y }
    let distance = Math.abs(kb["k"].x - kb["j"].x)
    kb["h"] = { x: based[2].x + distance * 1, y: based[2].y }
    kb["g"] = { x: based[2].x + distance * 2, y: based[2].y }
    kb["f"] = { x: based[2].x + distance * 3, y: based[2].y }
    kb["d"] = { x: based[2].x + distance * 4, y: based[2].y }
    kb["s"] = { x: based[2].x + distance * 5, y: based[2].y }
    kb["a"] = { x: based[2].x + distance * 6, y: based[2].y }
  }
  return kb
}

function findClosestKey(keyboard, position) {
  let output = undefined;
  let score = 0;
  for (let keyIndex in keyboard) {
    let key = keyboard[keyIndex];
    let currentScore = Math.abs(key.x - position.x);
    if ((!output) || (score > currentScore)) {
      output = keyIndex;
      score = currentScore;
    }
  }
  return output;
}