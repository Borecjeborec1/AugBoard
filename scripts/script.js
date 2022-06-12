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

const BODY_COLOR = [108, 73, 68]
const PAPER_COLOR = [0, 0, 0]
const TRESHOLD = 20;
const GAP_TRESHOLD = 3
let lastY = 0
let pointOnLine = 0
function mainEffect() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  let paper = []
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixelColor = [data[i], data[i + 1], data[i + 2]];
    if (colorDiff(PAPER_COLOR, pixelColor) < TRESHOLD) {
      paper.push({ x: (i / 4) % canvas.width, y: Math.floor((i / 4) / canvas.width) });
      const nextPixelColor = [data[i], data[i + 1], data[i + 2]];
      if (colorDiff(PAPER_COLOR, nextPixelColor) < TRESHOLD * 100) {
        paper.push({ x: (i + 1 / 4) % canvas.width, y: Math.floor((i + 1 / 4) / canvas.width) });
        i += 4;
      }
    }
  }
  let removedYs = {}
  for (let i = 0; i < paper.length; i += 2) {
    removedYs[paper[i].y] = removedYs[paper[i].y] == undefined ? 1 : removedYs[paper[i].y] + 1
  }

  paper = paper.filter((p) => removedYs[p.y] > 100);
  for (let i = 0; i < paper.length; i++) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(paper[i].x, paper[i].y, 1, 0, Math.PI * 2);
    ctx.fill()
  }
  requestAnimationFrame(mainEffect);

}

