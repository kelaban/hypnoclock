import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

const zeroPad = d3.format("02d");

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
  const hours = d3.timeHour.count(d3.timeDay.floor(now), now);

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
      valueFmt={(value) => zeroPad(Math.floor(value / 60) % 60)}
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
      valueFmt={(value) => zeroPad(Math.floor(value / 60) % 12)}
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
      valueFmt={(value) => zeroPad(value % 60)}
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
