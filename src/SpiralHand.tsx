import * as d3 from "d3";
import React from "react";

type SpiralHandT = {
  rotationsPerDay: number;
  unitsPerRotation: number;
  currentValue: number;
  maxRadius?: number;
  color: string;
  handColor?: string;
  unwind?: boolean;
  pathParams?: React.SVGProps<SVGPathElement>;
};

export default function SpiralHand({
  rotationsPerDay,
  unitsPerRotation,
  currentValue,
  color,
  handColor,
  maxRadius = 200,
  unwind = true,
  pathParams = {},
}: SpiralHandT) {
  let maxUnits = rotationsPerDay * unitsPerRotation;
  let value = currentValue;

  if (unwind && currentValue > maxUnits / 2) {
    value = maxUnits - value;
    maxUnits /= 2;
  }

  const angle = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, unitsPerRotation]);

  const radius = d3.scaleLinear().range([0, maxRadius]).domain([0, maxUnits]);

  const spiral = d3
    .lineRadial<undefined>()
    .angle((d, i) => angle(i))
    .radius((d, i) => radius(i))
    .curve(d3.curveBasis);

  const [cx, cy] = d3.pointRadial(angle(value - 1), radius(value - 1));

  return (
    <React.Fragment>
      <path
        stroke={color}
        fill="none"
        d={spiral({ length: value })}
        strokeWidth={2}
        {...pathParams}
      />
      <circle stroke="white" fill={handColor || color} cx={cx} cy={cy} r={10} />
    </React.Fragment>
  );
}
