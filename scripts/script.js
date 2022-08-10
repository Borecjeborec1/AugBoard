const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let video = document.createElement('video');
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    video.onloadeddata = mainEffect;
  })
  .catch((err) => {
    alert('Error: ' + err);
  });
// const PAPER_COLOR = [203, 77, 67]
let PAPER_COLOR = [97, 21, 34]
const COLOR_TRESHOLD = 25;
const HEIGHT_TRESHOLD = 80
const PAPER_SIZE_MIN = 15
const FINGER_UP_DISTANCE = 20
const FINGER_TAP_TRESHOLD = 5
const RIGHT_POINTER_FINGER_INDEX = 0


let basedPositions = []
let canGetBase = false
canvas.addEventListener("click", (e) => {

  PAPER_COLOR = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data
  console.log(ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data)
  setTimeout(() => {
    canGetBase = true
  }, 500)
})

const SOURCE_Y = 300
let keyboardPositions = { test: "test" }
function mainEffect() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight - SOURCE_Y;
  ctx.drawImage(video, 0, SOURCE_Y, video.videoWidth, video.videoHeight - SOURCE_Y, 0, 0, canvas.width, canvas.height)


  let paper = []
  let isNext = 0
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixelColor = [data[i], data[i + 1], data[i + 2]];
    if (colorDiff(PAPER_COLOR, pixelColor) < COLOR_TRESHOLD + isNext * 35) {
      paper.push({ x: (i / 4) % canvas.width, y: Math.floor((i / 4) / canvas.width) });
      isNext = 1
      continue
    }

    isNext = 0
  }

  if (paper.length > 5000) {
    console.log("too many color")
    return requestAnimationFrame(mainEffect)
  }


  let ys = paper.map(p => p.y)
  let avgY = ys.reduce((a, b) => a + b, 0) / ys.length
  paper = paper.filter(p => Math.abs(p.y - avgY) < HEIGHT_TRESHOLD)

  let xs = paper.map(p => p.x)
  xs = xs.filter((x, i) => xs.indexOf(x) === i)
  let fingersXLocs = splitFingers(xs, PAPER_SIZE_MIN)
  fingersXLocs = fingersXLocs.filter(f => f.length > 10)

  let fingersLocs = filterLocs(fingersXLocs, paper)
  let fingers = []

  for (let i = 0; i < fingersLocs.length; i++) {
    let finger = averagePos(fingersLocs[i], i, basedPositions)
    fingers.push(finger)
    if (!finger.length) continue

    let color = ctx.getImageData(finger.x, finger.y, 1, 1).data
    colors[0] = (color[0] + colors[0]) / 2
    colors[1] = (color[1] + colors[1]) / 2
    colors[2] = (color[2] + colors[2]) / 2
    PAPER_COLOR = colors
  }

  for (let i = 0; i < paper.length; i += 3) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(paper[i].x, paper[i].y, 3, 0, Math.PI * 2);
    ctx.fill()
  }

  let cyclist = basedPositions.length ? basedPositions : fingers
  for (let i = 0; i < cyclist.length; i++) {
    if (!fingers[i]) continue

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(fingers[i].x, fingers[i].y, 10, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(fingers[i].index, fingers[i].x, fingers[i].y);
  }
  if (basedPositions.length > 2) {
    let idk = fingers.length < basedPositions.length ? fingers.length : basedPositions.length
    fingers.sort((a, b) => a.index - b.index).reverse()
    for (let i = 0; i < idk; i++) {
      if (fingers[i].y > basedPositions[i].y + 10) {
        let key = findClosestKey(keyboardPositions, fingers[i])
        console.log(key + " is down")
        console.log("Finger positions: " + fingers[i].x + " " + fingers[i].y)
        console.log("Key position: " + keyboardPositions[key].x + " " + keyboardPositions[key].y)
      }
    }
  }

  if (canGetBase) {
    basedPositions = fingers
    canGetBase = false
    console.log("initialized")
    console.log(basedPositions)
    keyboardPositions = mapKeyboard(basedPositions)
    console.log(keyboardPositions)
  }

  requestAnimationFrame(mainEffect);

}

