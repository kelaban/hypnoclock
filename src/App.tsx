import * as d3 from "d3";
import React from "react";

const countSeconds = (start?: Date) =>
  d3.timeSecond.count(start ? start : d3.timeDay.floor(new Date()), new Date())

type SpiralHandT = {
  rotationsPerDay: number,
  unitsPerRotation: number,
  currentValue: number,
  maxRadius?: number,
  color: string,
  handColor?: string,
  unwind?: boolean,
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function StandardClock({ unwind = false, maxRadius }: { unwind: boolean, maxRadius: number }) {
  const [seconds, setSeconds] = React.useState<number>(countSeconds() + 1);

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setSeconds(countSeconds() + 1)
    }, 100)

    return () => {
      t.stop()
    }
  }, [setSeconds])

  const minutes = Math.floor(seconds / 60)
  const MinuteHand = <SpiralHand rotationsPerDay={24} unitsPerRotation={60 * 60} currentValue={seconds} color="#FFD63A" maxRadius={maxRadius} unwind={unwind} />
  const HourHand = <SpiralHand rotationsPerDay={2} unitsPerRotation={12 * 60} currentValue={minutes} color="#6DE1D2" maxRadius={maxRadius} unwind={unwind} />
  const SecondHand = <SpiralHand rotationsPerDay={60 * 24} unitsPerRotation={60} currentValue={seconds} color="#F75A5A" maxRadius={maxRadius} unwind={unwind} />

  return (
    <g transform={`translate(${maxRadius}, ${maxRadius})`} >
      {SecondHand}
      {MinuteHand}
      {HourHand}
    </g>
  )
}

function AgeClock({ birthday, color = "#F75A5A", maxRadius = 200 }: { birthday: Date, maxRadius: number, color?: string }) {
  const [now, setNow] = React.useState<Date>(new Date())
  const day = d3.timeDay.count(birthday, now)

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setNow(new Date())
    }, 1000)

    return () => {
      t.stop()
    }
  }, [setNow])

  const YearHand = <SpiralHand rotationsPerDay={110} unitsPerRotation={365} currentValue={day} color={color} maxRadius={maxRadius} unwind={false} />

  return (
    <g transform={`translate(${maxRadius}, ${maxRadius})`} >
      {YearHand}
    </g>
  )
}

function SpiralHand({ rotationsPerDay, unitsPerRotation, currentValue, color, handColor, maxRadius = 200, unwind = true }: SpiralHandT) {
  let maxUnits = rotationsPerDay * unitsPerRotation
  let value = currentValue
  if (unwind && currentValue > maxUnits / 2) {
    value = maxUnits - value
    maxUnits /= 2
  }
  const angle = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, unitsPerRotation])
  const radius = d3.scaleLinear().range([0, maxRadius]).domain([0, maxUnits])

  const spiral = d3
    .lineRadial<undefined>()
    .angle((d, i) => angle(i))
    .radius((d, i) => radius(i))
    .curve(d3.curveBasis);

  const [cx, cy] = d3.pointRadial(angle(value - 1), radius(value - 1))

  return (
    <React.Fragment>
      <path stroke={color} fill="none" d={spiral({ length: value })} strokeWidth={2} />
      <circle stroke="white" fill={handColor || color} cx={cx} cy={cy} r={10} />
    </React.Fragment>)
}


export function App() {
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  const maxRadius = Math.min(windowDimensions.height, windowDimensions.width) / 2

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  return (
    <div style={{ background: "black", width: "100%", height: "100vh", display: "flex" }}>
      <svg width={maxRadius * 2} height={maxRadius * 2} style={{ background: "none", display: "block", margin: "auto" }}>
        {/* <StandardClock unwind maxRadius={maxRadius} /> */}
        <AgeClock birthday={new Date("1990-03-17")} maxRadius={maxRadius} />
        <AgeClock birthday={new Date("1990-07-29")} maxRadius={maxRadius} color={"#FFD63A"}/>
        <AgeClock birthday={new Date("2025-01-31")} maxRadius={maxRadius} color={"#6DE1D2"}/>
      </svg>
    </div>
  );
}

export default App;
