import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

export default function AgeClock({
  birthday,
  color = "#F75A5A",
  maxAge = 100,
  maxRadius = 200,
}: {
  birthday: Date;
  maxRadius: number;
  color?: string;
  maxAge?: number
}) {
  const [now, setNow] = React.useState<Date>(new Date());
  const [max, setMax] = React.useState<number>(1)
  const day = d3.timeDay.count(birthday, now);

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setNow(new Date());
    }, 1000);


    return () => {
      t.stop();
    };
  }, [setMax]);

  const YearHand = (
    <SpiralHand
      rotationsPerPeriod={maxAge}
      unitsPerRotation={365}
      currentValue={day}
      color={color}
      maxRadius={maxRadius}
      unwind={false}
    />
  );

  return <g transform={`translate(${maxRadius}, ${maxRadius})`}>{YearHand}</g>;
}
