import React, {useRef} from 'react'
import ReactDOM        from 'react-dom'
import Chart           from 'chart.js'

let interval

function makeChart (canvas) {
  console.log('try and render')

  if (canvas.current) {

    console.log('render')

    const chart = new Chart(
      canvas.current,
      {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Scatter Dataset',
            data : [
              {x:-10, y:0},
              {x:0, y:10},
              {x:10, y:5}
            ]
          }]
        },
        options: {}
      }
    )

    clearInterval(interval)
    console.log(chart)
  }
}

function App () {
  const canvas = useRef(null)

  // [{x: 10, y: 20}, {x: 15, y: 10}]
  interval = global.setInterval(() => makeChart(canvas), 10)
  return (
    <div>
      <canvas ref={canvas} width="400" height="400" />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
