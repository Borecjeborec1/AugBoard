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
const VIDEO_SCALE = .3
// const PAPER_COLOR = [0, 0, 0]
const PAPER_COLOR = [203, 77, 67]
const COLOR_TRESHOLD = 13;
const HEIGHT_TRESHOLD = 80
const PAPER_SIZE_MIN = 15
const FINGER_UP_DISTANCE = 20
let basedPositions = []
let canGetBase = false
setTimeout(() => {
  canGetBase = true
  console.log("initialized")
}, 5000)
let sy = 340
function mainEffect() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight - sy;
  ctx.drawImage(video, 0, sy, video.videoWidth, video.videoHeight - sy, 0, 0, canvas.width, canvas.height)

  let paper = []
  let isNext = 0
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixelColor = [data[i], data[i + 1], data[i + 2]];
    if (colorDiff(PAPER_COLOR, pixelColor) < COLOR_TRESHOLD + isNext * 50) {
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
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(cyclist[i].index, cyclist[i].x, cyclist[i].y);
    if (!fingers[i]) continue

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(fingers[i].x, fingers[i].y, 10, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(cyclist[i].index, fingers[i].x, fingers[i].y);
  }
  if (basedPositions.length) {
    let idk = fingers.length < basedPositions.length ? fingers.length : basedPositions.length
    for (let i = 0; i < idk; i++) {
      if (isNearY(basedPositions[i], fingers[i], FINGER_UP_DISTANCE)) {
        if (!basedPositions[i].isDown) {
          console.log("finger " + i + " tapped", fingers[i], basedPositions[i])
          basedPositions[i].isDown = true
        }
      } else {
        basedPositions[i].isDown = false
      }
    }
  }

  if (canGetBase) {
    basedPositions = fingers
    canGetBase = false
  }

  requestAnimationFrame(mainEffect);

}

