import * as math from 'mathjs'

function mandelbrot (Z, C) {
  return C.add(Z.mul(Z))
}

const complexNumber = math.complex
const maxIter = 720

function iterateMandelbrot (startingX, startingY) {
  let i = 0
  let Z = complexNumber(0, 0)
  const C = complexNumber(startingX, startingY)

  while (Z.abs() <= 2) {
    if (i++ === maxIter) return false

    Z = mandelbrot(Z, C)
  }

  return i
}

const width = window.innerWidth
const height = window.innerHeight

const canvasSize = (width < height ? width : height)

const stepSize = Math.round(canvasSize / 500)
// const stepSize = 1

const gridWidth = 4
const startX = -2
const gridHeight = -4
const startY = 2

function coordinateForPixel (pixelNumber, gridSize, gridStart) {
  const canvasGridRatio = canvasSize / gridSize
  const gridNumber = pixelNumber / canvasGridRatio

  return Math.round((gridNumber + gridStart) * canvasSize) / canvasSize
}

function pixelToX (x) {
  return coordinateForPixel(x, gridWidth, startX)
}

function pixelToY (y) {
  return coordinateForPixel(y, gridHeight, startY)
}

const iterationCounts = []

function getStylingLoopValue (iterationCount, maxValue) {
  return iterationCount % maxValue
}

function getStylingToMaxValue (iterationCount, maxValue, stylingFactor) {

  // stylingFactor = how many iterations is 1% of maxValue
  const number = Math.pow(iterationCount / stylingFactor, 2) * maxValue

  if (number >= maxValue) return maxValue
  else return Math.round(number)
}

const hueMax = 360

function getHue (iterationCount) {
  return getStylingLoopValue(
    getStylingToMaxValue(iterationCount, hueMax, maxIter / 6) + 90,
    hueMax
  )
  // return getStylingLoopValue(iterationCount, hueMax)
}

const luminanceMax = 50

function getLuminance (iterationCount) {
  // return 50
  return getStylingToMaxValue(iterationCount, luminanceMax, 30)
  // return getStylingLoopValue(iterationCount, luminanceMax)
}

function getFillStyle (pixelX, pixelY) {
  const iterationCount = iterateMandelbrot(pixelToX(pixelX), pixelToY(pixelY))
  iterationCounts.push(iterationCount)

  const hslString = `hsl(${getHue(iterationCount)}, 100%, ${getLuminance(iterationCount)}%)`

  if (iterationCount) return hslString
  else return '#131313'
}

function drawPixel (canvasContext, x, y) {
  canvasContext.fillStyle = 'red'
  canvasContext.fillRect(x + stepSize, y, stepSize, stepSize)

  canvasContext.fillStyle = getFillStyle(x, y)
  canvasContext.fillRect(x, y, stepSize, stepSize)
}

function drawPixelPromise (canvasContext, x, y) {
  return new Promise(resolve => {
    window.setTimeout(() => {
      drawPixel(canvasContext, x, y)
      resolve()
    }, 0)
  })
}

function logStats () {
  function getAverage (numbers, counter = n => n) {
    let total = 0
    for (const number of numbers) total += counter(number)
    return total / numbers.length
  }

  function getAverageIterationCount () {
    return getAverage(iterationCounts)
  }

  function getMedianIterationCount () {
    const sorted = iterationCounts.sort()
    return sorted[Math.round(iterationCounts.length / 2)]
  }

  console.log('iteration stats:')
  console.log('amount of pixels calculated', iterationCounts.length)
  console.log('average iteration count:', getAverageIterationCount())
  console.log('median iteration count', getMedianIterationCount())
  console.log('time elapsed', Math.round((endTime - startTime) / 100) / 10, 'seconds')
}

// fast but nothing is shown until it is done
function drawNextPixelSynchronous (canvasContext, x, y) {
  while (y <= canvasSize) {
    while (x <= canvasSize) {

      drawPixel(canvasContext, x, y)
      x += stepSize
    }

    x = 0
    y += stepSize
  }

  console.log('done')
  endTime = performance.now()
  logStats()
}

// ensure calculation happens after previous pixel is drawn but really freaking slow
async function drawNextPixelPromise (canvasContext, x, y) {
  await drawPixelPromise(canvasContext, x, y)

  if (x <= canvasSize) {
    x += stepSize

  } else if (y <= canvasSize) {
    x = 0
    y += stepSize

  } else {
    console.log('done')
    endTime = performance.now()
    logStats()

    return
  }

  drawNextPixelPromise(canvasContext, x, y)
}

// readies all pixels in one go and then starts calculating them
function drawNextPixelDeferred (canvasContext, x, y) {
  while (y <= canvasSize) {
    while (x <= canvasSize) {
      const newX = x
      const newY = y
      window.setTimeout(() => {
        drawPixel(canvasContext, newX, newY)
      }, 0)

      x += stepSize
    }

    x = 0
    y += stepSize
  }

  window.setTimeout(() => {
    console.log('done')
    endTime = performance.now()
    logStats()
  }, 0)
}

const startTime = performance.now()
let endTime

function drawMandelbrot (canvasRef, currentPixel, setCurrentPixel) {
  console.log('drawMandelbrot')

  const canvasContext = canvasRef.getContext('2d')
  const x = 0
  const y = 0

  // drawNextPixelSynchronous(canvasContext, x, y)
  // drawNextPixelPromise(canvasContext, x, y)
  drawNextPixelDeferred(canvasContext, x, y)
}

const canvasElement = document.createElement('canvas')
canvasElement.setAttribute('width', canvasSize)
canvasElement.setAttribute('height', canvasSize)

document.getElementById('root').appendChild(canvasElement)

drawMandelbrot(canvasElement)
