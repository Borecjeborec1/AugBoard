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


const COLOR_TRESHOLD = 25;
const HEIGHT_TRESHOLD = 80
const PAPER_SIZE_MAX = 15
const SOURCE_Y = 300


let paperColor = localStorage.getItem("paperColor") ? JSON.parse(localStorage.getItem("paperColor")) : []
let basedPositions = []
let canGetBase = false
let keyboardPositions = { test: "test" }
let lastKey = ""

canvas.addEventListener("click", (e) => {
  paperColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data
  localStorage.setItem("paperColor", JSON.stringify(paperColor))
  setTimeout(() => {
    canGetBase = true
  }, 500)
})

function mainEffect() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight - SOURCE_Y;
  ctx.drawImage(video, 0, SOURCE_Y, video.videoWidth, video.videoHeight - SOURCE_Y, 0, 0, canvas.width, canvas.height)

  let paper = []
  let isNext = 0
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixelColor = [data[i], data[i + 1], data[i + 2]];
    if (colorDiff(paperColor, pixelColor) < COLOR_TRESHOLD + isNext * 20) {
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
  let fingersXLocs = splitFingers(xs, PAPER_SIZE_MAX).filter(f => f.length > 10)

  let fingersLocs = filterLocs(fingersXLocs, paper)
  let fingers = []

  for (let i = 0; i < fingersLocs.length; i++) {
    let finger = averagePos(fingersLocs[i], i, basedPositions)
    fingers.push(finger)
    if (!finger.length) continue
  }

  for (let i = 0; i < paper.length; i += 3) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(paper[i].x, paper[i].y, 3, 0, Math.PI * 2);
    ctx.fill()
  }


  for (let i = 0; i < (basedPositions.length ? basedPositions.length : fingers.length); i++) {
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
    fingers.sort((a, b) => a.index - b.index).reverse()
    for (let i = 0; i < (fingers.length < basedPositions.length ? fingers.length : basedPositions.length); i++) {
      if (fingers[i].y > basedPositions[i].y + 10) {
        let key = findClosestKey(keyboardPositions, fingers[i])
        if (key == undefined) {
          console.log("key not found")
          continue
        }
        if (key !== lastKey) {
          console.log(key + " is down")
          console.log(lastKey + " was last down")
          lastKey = key
          console.log("Finger: " + JSON.stringify(fingers[i]))
          console.log("Finger positions: " + fingers[i].x + " " + fingers[i].y)
          console.log("Key position: " + keyboardPositions[key].x + " " + keyboardPositions[key].y)
        }
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

