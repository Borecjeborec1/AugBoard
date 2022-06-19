// let arr = [188, 189, 190, 191, 192, 193, 194, 195, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 227, 316, 315, 327]

// function splitFingers(xs) {
//   xs.sort((a, b) => a - b)
//   let fingers = []
//   let finger = []
//   for (let i = 0; i < xs.length; i++) {
//     if (xs[i] + 1 !== xs[i + 1]) {
//       fingers.push(finger)
//       finger = []
//     } else {
//       finger.push(xs[i])
//     }
//   }
//   return fingers
// }
// console.log(splitFingers(arr))

let nums = [0, 1, 2, 5, 3]
console.log(nums)
nums.sort((a, b) => a - b)
console.log(nums)


// // having an array xLocs containing all x locations [[1, 2, 3], [4, 5, 6], [7, 8, 9]] and array locs containg all locs [{x: 1, y: 2}, {x: 2, y: 2}, {x: 4, y: 5}, {x: 7, y: 8}] filter the array locs to only contain the locations that are in the array xLocs and return it as [[{x: 1, y: 2},{x: 2, y: 2}], [{x: 4, y: 5}], [{x: 7, y: 8}]]
// let xLocs = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// let locs = [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 5 }, { x: 7, y: 8 }]
// function filterLocs(xLocs, locs) {
//   let filteredLocs = []
//   for (let i = 0; i < xLocs.length; i++) {
//     let filtered = locs.filter((loc) => xLocs[i].includes(loc.x))
//     filteredLocs.push(filtered)
//   }
//   return filteredLocs
// }
// console.log(filterLocs(xLocs, locs))