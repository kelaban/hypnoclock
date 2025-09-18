import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";

export default function YearClock({
  weekColor,
  weekWeight,
  monthColor,
  monthWeight,
  yearColor,
  yearWeight,
  maxRadius,
  labelSize,
}: {
  maxRadius: number;
  weekColor: string;
  weekWeight: number;
  monthColor: string;
  monthWeight: number;
  yearColor: string;
  yearWeight: number;
  labelSize: number;
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

  const WeekHand = (
    <SpiralHand
      rotationsPerPeriod={52}
      unitsPerRotation={(365 / 52) * 24}
      currentValue={hours}
      color={weekColor}
      maxRadius={maxRadius}
      pathParams={{ strokeWidth: weekWeight }}
      valueFmt={(value) => "week " + d3.timeFormat("%V")(new Date())}
      labelSize={labelSize}
    />
  );

  const MonthHand = (
    <SpiralHand
      unitsPerRotation={365 / 12}
      rotationsPerPeriod={12}
      currentValue={days}
      color={monthColor}
      maxRadius={maxRadius}
      valueFmt={(value) => "" + d3.timeFormat("%d")(new Date())}
      pathParams={{ strokeWidth: monthWeight }}
      labelSize={labelSize}
    />
  );

  const YearHand = (
    <SpiralHand
      rotationsPerPeriod={1}
      unitsPerRotation={52}
      currentValue={week}
      color={yearColor}
      maxRadius={maxRadius}
      valueFmt={(value) => "" + d3.timeFormat("%B")(new Date()).toLowerCase()}
      pathParams={{ strokeWidth: yearWeight }}
      labelSize={labelSize}
    />
  );

  return (
    <g transform={`translate(${maxRadius}, ${maxRadius})`}>
      {WeekHand}
      {MonthHand}
      {YearHand}
    </g>
  );
}
