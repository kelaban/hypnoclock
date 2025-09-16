import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

export default function DailyClock({ unwind = false, maxRadius }: { unwind: boolean, maxRadius: number }) {
  const [now, setNow] = React.useState<Date>(new Date())
  const seconds = d3.timeSecond.count(d3.timeDay.floor(now), now)
  const minutes = d3.timeMinute.count(d3.timeDay.floor(now), now)

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setNow(new Date())
    }, 100)

    return () => {
      t.stop()
    }
  }, [setNow])


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