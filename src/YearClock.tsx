import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

export default function YearClock({
  dayColor,
  monthColor,
  weekColor,
  maxRadius,
}: {
  maxRadius: number;
  dayColor: string;
  monthColor: string;
  weekColor: string;
}) {
  const [now, setNow] = React.useState<Date>(new Date());
  const days = d3.timeDay.count(d3.timeYear.floor(now), now) + 1;
  const hours = d3.timeHour.count(d3.timeYear.floor(now), now) + 1;
  const week = d3.timeWeek.count(d3.timeYear.floor(now), now) + 1;

  React.useEffect(() => {
    const t = d3.interval((elapsed) => {
      setNow(new Date());
    }, 1000);

    return () => {
      t.stop();
    };
  }, [setNow]);

  const DayHand = (
    <SpiralHand
      unitsPerRotation={365 / 12}
      rotationsPerPeriod={12}
      currentValue={days}
      color={dayColor}
      maxRadius={maxRadius}
    />
  );

  const MonthHand = (
    <SpiralHand
      rotationsPerPeriod={1}
      unitsPerRotation={52}
      currentValue={week}
      color={monthColor}
      maxRadius={maxRadius}
    />
  );

  const WeekHand = (
    <SpiralHand
      rotationsPerPeriod={52}
      unitsPerRotation={(365 / 52) * 24}
      currentValue={hours}
      color={weekColor}
      maxRadius={maxRadius}
    />
  );

  return (
    <g transform={`translate(${maxRadius}, ${maxRadius})`}>
      {WeekHand}
      {DayHand}
      {MonthHand}
    </g>
  );
}
