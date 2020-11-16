import React, {useEffect, useRef} from 'react'
import ReactDOM                   from 'react-dom'
import Chart                      from 'chart.js'
import * as math from 'mathjs'

// const a = 0 // real, x axis
// const b = 0 // imaginary, y axis
// const i = Math.sqrt(-1)

const complexNumber = math.complex

console.log(complexNumber)

function mandelbrot (Z, C) {
  return C.add(Z.mul(Z))
}

const maxIter = 100

function iterateMandelbrot (startingPoint) {
  let i = 0
  let Z = complexNumber(0, 0)
  const C = complexNumber(startingPoint[0], startingPoint[1])

  while (Z.abs() <= 2) {
    if (i++ === maxIter) return false

    Z = mandelbrot(Z, C)

    console.log('current Z value:', Z.toVector())
  }

  return i
}

const data = [
  // example
  {x:-1, y:0, color:'red'},
  {x:0, y:1, fillColor:'green'},
  {x:1, y:0.5, fillColor:'blue'}
]

const iterationAmount = iterateMandelbrot([0.5, 0.5])
console.log('iteration amount', iterationAmount)

// // radius
// // pointStyle
// // rotation
// // backgroundColor
// // borderWidth
// // borderColor
// // hitRadius
// // hoverRadius
// // hoverBorderWidth

// function makeChart (canvas) {
//   if (canvas.current) {
//     return new Chart(
//       canvas.current,
//       {
//         type: 'scatter',
//         data: {
//           datasets: [{
//             label: 'Mandelbrot',
//             data
//           }]
//         },
//         options: {
//           scales: {
//             xAxes: [{ticks:{max:2, min:-2}}],
//             yAxes: [{ticks:{max:2, min:-2}}]
//           },
//           points: {
//             backgroundColor: 'white'
//           }
//         }
//       }
//     )
//   }
// }

function App () {
  const canvas = useRef(null)

  // useEffect(() => {makeChart(canvas)}, [])

  return (
    <div style={{flex:1}}>
      <canvas ref={canvas} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
