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

const PAPER_COLOR = [0, 0, 0] // DAY
// const PAPER_COLOR = [154, 120, 36] // DAY
// let PAPER_COLOR = [189, 181, 82] // LIGHT
// const PAPER_COLOR = [91, 66, 27] // DARK
const COLOR_TRESHOLD = 20;
const HEIGHT_TRESHOLD = 80
let lastY = 0
let pointOnLine = 0
function mainEffect() {
  video.videoHeight = video.videoHeight / 2;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  let paper = []
  let isNext = 0
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3 * data.length / 4; i < data.length; i += 4) {
    const pixelColor = [data[i], data[i + 1], data[i + 2]];
    if (colorDiff(PAPER_COLOR, pixelColor) < COLOR_TRESHOLD + isNext * 50) {
      paper.push({ x: (i / 4) % canvas.width, y: Math.floor((i / 4) / canvas.width) });
      isNext = 1
      continue
    }
    isNext = 0
  }
  let ys = paper.map(p => p.y)
  let avgY = ys.reduce((a, b) => a + b, 0) / ys.length

  paper = paper.filter(p => Math.abs(p.y - avgY) < HEIGHT_TRESHOLD)
  let xs = paper.map(p => p.x)
  xs = xs.filter((x, i) => xs.indexOf(x) === i)
  let minX = Math.min(...xs)
  let maxX = Math.max(...xs)
  let fingersAmmount = 5
  let fingerWidth = (maxX - minX) / fingersAmmount
  let fingers = []
  let colors = []
  for (let i = 0; i < fingersAmmount; i++) {
    let finger = averagePos(paper.filter(p => p.x > minX + i * fingerWidth && p.x < minX + (i + 1) * fingerWidth))
    fingers.push(finger)
    if (!finger.length) continue
    let color = ctx.getImageData(finger.x, finger.y, 1, 1).data
    colors[0] = (color[0] + colors[0]) / 2
    colors[1] = (color[1] + colors[1]) / 2
    colors[2] = (color[2] + colors[2]) / 2
    PAPER_COLOR = colors
  }
  // for (let i = 0; i < paper.length; i++) {
  //   ctx.fillStyle = 'green';
  //   ctx.beginPath();
  //   ctx.arc(paper[i].x, paper[i].y, 2, 0, Math.PI * 2);
  //   ctx.fill()
  // }
  for (let i = 0; i < fingers.length; i++) {
    // write finger index on canvas
    // ctx.fillStyle = 'red';
    // ctx.beginPath();
    // ctx.arc(fingers[i].x, fingers[i].y, 10, 0, Math.PI * 2);
    // ctx.fill()
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(i + 1, fingers[i].x, fingers[i].y);
  }


  requestAnimationFrame(mainEffect);

}

