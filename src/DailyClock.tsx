import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

export default function DailyClock({
  unwind = false,
  minuteColor,
  hourColor,
  secondColor,
  maxRadius,
}: {
  unwind: boolean;
  maxRadius: number;
  minuteColor: string;
  hourColor: string;
  secondColor: string;
}) {
  const [now, setNow] = React.useState<Date>(new Date());
  const seconds = d3.timeSecond.count(d3.timeDay.floor(now), now);
  const minutes = d3.timeMinute.count(d3.timeDay.floor(now), now);

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setNow(new Date());
    }, 100);

    return () => {
      t.stop();
    };
  }, [setNow]);

  const MinuteHand = (
    <SpiralHand
      rotationsPerPeriod={24}
      unitsPerRotation={60 * 60}
      currentValue={seconds}
      color={minuteColor}
      maxRadius={maxRadius}
      unwind={unwind}
    />
  );
  const HourHand = (
    <SpiralHand
      rotationsPerPeriod={2}
      unitsPerRotation={12 * 60}
      currentValue={minutes}
      color={hourColor}
      maxRadius={maxRadius}
      unwind={unwind}
    />
  );
  const SecondHand = (
    <SpiralHand
      rotationsPerPeriod={60 * 24}
      unitsPerRotation={60}
      currentValue={seconds}
      color={secondColor}
      maxRadius={maxRadius}
      unwind={unwind}
      pathParams={{ strokeWidth: 0.5 }}
    />
  );

  return (
    <g transform={`translate(${maxRadius}, ${maxRadius})`}>
      {SecondHand}
      {MinuteHand}
      {HourHand}
    </g>
  );
}
