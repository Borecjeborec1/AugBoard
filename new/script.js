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

let paperColor = []
let clickedPos = {}
canvas.addEventListener("click", (e) => {
  paperColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data
  console.log("clicked color: " + paperColor)
  clickedPos.x = e.offsetX
  clickedPos.y = e.offsetY
})

function mainEffect() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height)
  if (!clickedPos.x) {
    return requestAnimationFrame(mainEffect)
  }

  const takenRect = {
    x: clickedPos.x - 200,
    y: clickedPos.y - 20,
    width: 400,
    height: 40
  }

  let pixels = {}
  let isNext = 0
  const { data } = ctx.getImageData(takenRect.x, takenRect.y, takenRect.width, takenRect.height);
  ctx.fillStyle = 'green';
  ctx.strokeRect(takenRect.x, takenRect.y, takenRect.width, takenRect.height);
  for (let i = 0; i < data.length; i += 4) {
    if (
      Math.abs(data[i] - paperColor[0]) < (40 + !!isNext * 5) &&
      Math.abs(data[i + 1] - paperColor[1]) < (40 + !!isNext * 40) &&
      Math.abs(data[i + 2] - paperColor[2]) < (40 + !!isNext * 5)
    ) {

      pixels[i / 4] = { x: (i / 4) % takenRect.width + takenRect.x, y: Math.floor((i / 4) / takenRect.width) + takenRect.y }
      isNext = isNext < 30 ? isNext + 1 : 0
    } else {
      isNext = 0
    }

  }
  let newPixels = filterPixels(pixels, takenRect.width)

  let xs = splitCoordinates(newPixels.map(p => p.x).sort((a, b) => a - b), 3).filter(e => e.length > 30)
  let averages = xs.map(xs => xs.reduce((sum, x) => sum + x, 0) / xs.length);
  let fingers = mapFingers(newPixels, averages)

  console.log(fingers)

  for (let i = 0; i < newPixels.length; ++i) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(newPixels[i].x, newPixels[i].y, 1, 0, Math.PI * 2);
    ctx.fill()
  }
  for (let i = 0; i < fingers.length; ++i) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(fingers[i].x, fingers[i].y, 3, 0, Math.PI * 2);
    ctx.fill()
    ctx.fillText(fingers[i].index, fingers[i].x, fingers[i].y);
  }
  requestAnimationFrame(mainEffect)
}

function filterPixels(pixels, width) {
  let res = []
  for (let i in pixels) {
    let counter = 0
    if (pixels[+i + 1]) counter++
    if (pixels[+i - 1]) counter++
    if (pixels[+i + +width]) counter++
    if (pixels[+i + +width + 1]) counter++
    if (pixels[+i + +width - 1]) counter++
    if (pixels[+i - +width]) counter++
    if (pixels[+i - +width + 1]) counter++
    if (pixels[+i - +width - 1]) counter++
    if (counter > 5) {
      res.push(pixels[i])
    }
  }
  return res
}

function splitCoordinates(xCoords, threshold) {
  const result = [];
  let subarray = [xCoords[0]];
  for (let i = 1; i < xCoords.length; i++) {
    if (xCoords[i] - xCoords[i - 1] > threshold) {
      result.push(subarray);
      subarray = [xCoords[i]];
    } else {
      subarray.push(xCoords[i]);
    }
  }
  result.push(subarray);
  return result;
}

// function mapFingers(pixels, avgX) {
//   const fingers = new Array(avgX.length).fill([]);

//   for (let i = 0; i < pixels.length; i++) {
//     let minDist = Number.MAX_VALUE;
//     let closestFinger = -1;

//     for (let j = 0; j < avgX.length; j++) {
//       const dist = Math.abs(pixels[i].x - avgX[j]);

//       if (dist < minDist) {
//         minDist = dist;
//         closestFinger = j;
//       }
//     }

//     fingers[closestFinger].push(pixels[i]);
//   }

//   return fingers;
// }

function mapFingers(pixels, avgX) {
  let fingers = [];
  for (let i = 0; i < avgX.length; i++) {
    let fingerPixels = pixels.filter(p => Math.abs(p.x - avgX[i]) < 10);
    let sumY = fingerPixels.reduce((sum, p) => sum + p.y, 0);
    fingers.push({ x: avgX[i], y: sumY / fingerPixels.length, index: i });
  }
  return fingers;
}