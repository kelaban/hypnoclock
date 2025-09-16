import * as d3 from "d3";
import React from "react"
import SpiralHand from "./SpiralHand";

export default function AgeClock({ birthday, color = "#F75A5A", maxRadius = 200 }: { birthday: Date, maxRadius: number, color?: string }) {
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