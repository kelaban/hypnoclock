import * as d3 from "d3";
import React from "react";

const countSeconds = (start?: Date) =>
  d3.timeSecond.count(start ? start : d3.timeDay.floor(new Date()), new Date())

const countMinutes = () =>
  d3.timeMinute.count(d3.timeDay.floor(new Date()), new Date())

const countHours = () =>
  d3.timeHour.count(d3.timeDay.floor(new Date()), new Date())

const start = d3.timeSecond.offset(new Date(), -300)

const maxRadius = 150
const maxMinutes = (60 * 24)
const maxHours = 24

type SpiralHandT = {
  rotationsPerDay: number,
  unitsPerRotation: number,
  currentValue: number,
  maxRadius?: number,
  color: string,
  handColor?: string
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function SpiralHand({ rotationsPerDay, unitsPerRotation, currentValue, color, handColor, maxRadius = 200 }: SpiralHandT) {
  const angle = (l: number) => (Math.PI / unitsPerRotation) * 2 * l
  const progress = (l: number) => l / (rotationsPerDay * unitsPerRotation)
  const radius = (l: number) => progress(l) * maxRadius

  const spiral = d3
    .lineRadial<undefined>()
    .angle((d, i) => angle(i))
    .radius((d, i) => radius(i))
    .curve(d3.curveBasis);

  const hand = d3.lineRadial()([[0, 0], [angle(currentValue - 1), radius(currentValue - 1)]])

  return (
  <React.Fragment>
    <path stroke={color} fill="none" d={spiral({ length: currentValue })} />
    <path stroke={handColor || color} fill="none" d={hand} strokeWidth={3}/>
  </React.Fragment>)
}


export function App() {
  const [minutes, setMinutes] = React.useState<number>(countMinutes()+1);
  const [hours, setHours] = React.useState<number>(countHours()+1);
  const [seconds, setSeconds] = React.useState<number>(countSeconds()+1);
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  const maxRadius = Math.min(windowDimensions.height, windowDimensions.width) / 2

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setMinutes(countMinutes()+1)
      setHours(countHours()+1)
      setSeconds(countSeconds()+1)
    }, 500)

    return () => {
      t.stop()
    }
  }, [setMinutes, setHours])

  // const MinuteHand = <SpiralHand rotationsPerDay={24} unitsPerRotation={60} currentValue={minutes} color="red"/>
  // const HourHand = <SpiralHand rotationsPerDay={2} unitsPerRotation={12} currentValue={hours} color="yellow"/>
  // const SecondHand = <SpiralHand rotationsPerDay={60*24} unitsPerRotation={60} currentValue={seconds} color="purple" handColor="white"/>
  const MinuteHand = <SpiralHand rotationsPerDay={24} unitsPerRotation={60} currentValue={minutes} color="#FFD63A" maxRadius={maxRadius}/>
  const HourHand = <SpiralHand rotationsPerDay={2} unitsPerRotation={12} currentValue={hours} color="#6DE1D2" maxRadius={maxRadius}/>
  const SecondHand = <SpiralHand rotationsPerDay={60*24} unitsPerRotation={60} currentValue={seconds} color="#F75A5A" handColor="white" maxRadius={maxRadius}/>

  return (
    <div style={{ background: "#6DE1D2", width: "100%", height:"100vh", display: "flex" }}>
      <svg width={maxRadius*2} height={maxRadius*2} style={{ background: "#6DE1D2", display: "block", margin:"auto" }}>
        <g transform={`translate(${maxRadius}, ${maxRadius})`} >
          {SecondHand}
          {MinuteHand}
          {HourHand}
        </g>
      </svg>
    </div>
  );
}

export default App;
