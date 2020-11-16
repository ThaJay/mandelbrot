import React, {useEffect, useRef, useState} from 'react'
import ReactDOM                   from 'react-dom'
import * as math from 'mathjs'

function mandelbrot (Z, C) {
  return C.add(Z.mul(Z))
}

const complexNumber = math.complex
const maxIter = 1000

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

const size = (width < height ? width : height)

const stepSize = Math.round(size / 500)

function coordinateForPixel (p) {
  return Math.round(((p / (size / 4)) - 2) * size) / size
}

function pixelToX (x) {
  return coordinateForPixel(x)
}

function pixelToY (y) {
  return -coordinateForPixel(y)
}

// [0,0] = [-2,-2]
// [400,400] = [2,2]
// [200,200] = [0,0]

const iterationCounts = []

const stylingFactor = maxIter / 16
const hueMax = 360
const luminanceMax = 50

function getStylingValue (iterationCount, maxValue) {
  const number = iterationCount / stylingFactor * maxValue

  if (number >= maxValue) return maxValue
  else return Math.round(number)
}

function getHue (iterationCount) {
  return getStylingValue(iterationCount, hueMax)
}

function getLuminance (iterationCount) {
  return getStylingValue(iterationCount, luminanceMax)
}

function getFillStyle (pixelX, pixelY) {
  const iterationCount = iterateMandelbrot(pixelToX(pixelX), pixelToY(pixelY))
  iterationCounts.push(iterationCount)

  // const hslString = `hsl(${getHue(iterationCount)}, 100%, 50%)`
  const hslString = `hsl(${getHue(iterationCount)}, 100%, ${getLuminance(iterationCount)}%)`

  if (iterationCount) return hslString
  else return '#111'
}

function drawNextX (canvasContext, x, y) {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(x + 1, y, stepSize, stepSize)

  canvasContext.fillStyle = getFillStyle(x, y)
  canvasContext.fillRect(x, y, stepSize, stepSize)
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
  // 6 iterations = 100%
}

function drawMandelbrot (canvasRef, currentPixel, setCurrentPixel) {
  if (canvasRef.current) {
    let {x, y} = currentPixel
    const canvasContext = canvasRef.current.getContext('2d')

    if (y <= size) {
      if (x <= size) {
        drawNextX(canvasContext, x, y)
        setCurrentPixel({x:x += stepSize, y})

      } else {
        setCurrentPixel({x:0, y:y += stepSize})

      }
    } else {
      console.log('done')
      logStats()
    }
  }
}

function App () {
  const canvasRef = useRef(null)
  const [currentPixel, setCurrentPixel] = useState({x:0, y:0})

  function drawNextIteration () {
    window.setTimeout(() => {
      drawMandelbrot(canvasRef, currentPixel, setCurrentPixel)
    }, 0)
  }

  useEffect(drawNextIteration, [canvasRef, currentPixel])

  return (
    <canvas width={size} height={size} ref={canvasRef} />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
