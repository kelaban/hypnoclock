import * as d3 from "d3";
import React from "react";

type SpiralHandT = {
  rotationsPerPeriod: number;
  unitsPerRotation: number;
  currentValue: number;
  maxRadius?: number;
  color: string;
  handColor?: string;
  unwind?: boolean;
  pathParams?: React.SVGProps<SVGPathElement>;
  valueFmt?: (currentValue: number) => string;
  rangeScale?: d3.ScaleContinuousNumeric<number, number>;
  labelSize?: number;
};

export default function SpiralHand({
  rotationsPerPeriod: rotationsPerDay,
  unitsPerRotation,
  currentValue,
  color,
  handColor,
  maxRadius = 200,
  unwind = false,
  pathParams = {},
  valueFmt = undefined,
  //rangeScale = d3.scaleLinear(),
  rangeScale = d3.scalePow().exponent(0.6),
  labelSize = 25,
}: SpiralHandT) {
  let maxUnits = rotationsPerDay * unitsPerRotation;
  let value = currentValue;
  let padding = 30;

  if (unwind && currentValue > maxUnits / 2) {
    value = maxUnits - value;
    maxUnits /= 2;
  }

  const angle = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, unitsPerRotation]);

  const radius = rangeScale
    .range([0, maxRadius - padding])
    .domain([0, maxUnits]);

  const spiral = d3
    .lineRadial<undefined>()
    .angle((d, i) => angle(i))
    .radius((d, i) => radius(i))
    .curve(d3.curveBasis);

  const cAngle = angle(value - 1) % (2 * Math.PI);
  const cRadius = radius(value - 1);
  const cR = 10;
  const tX = cR + 4;

  return (
    <React.Fragment>
      <path
        stroke={color}
        fill="none"
        d={spiral(Array.from({ length: value })) || ""}
        strokeWidth={2}
        {...pathParams}
      />
      <g
        transform={`rotate(${(cAngle * 180) / Math.PI - 90}) translate(${cRadius})`}
      >
        <circle stroke="white" fill={handColor || color} cx={0} cy={0} r={cR} />
        <text
          transform={`rotate(90) translate(-${tX}, -${cR * 2})`}
          textAnchor={"middle"}
          fill={color}
          dy={"0.35em"}
          x={tX}
          style={{
            fontSize: labelSize,
            fontFamily: "Zalando Sans Expanded",
          }}
        >
          {valueFmt && valueFmt(currentValue)}
        </text>
      </g>
    </React.Fragment>
  );
}
