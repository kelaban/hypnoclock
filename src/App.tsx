import * as d3 from "d3";
import * as z from "zod";
import React from "react";
import AgeClock from "./AgeClock";
import DailyClock from "./DailyClock";
import { Outlet, useOutletContext, useSearchParams } from "react-router";
import YearClock from "./YearClock";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

type ContextType = { maxRadius: number };

const YearClockParams = z.object({
  weekColor: z.string().default("black"),
  weekWeight: z.string().default("0.2").pipe(z.coerce.number()),
  monthColor: z.string().default("red"),
  monthWeight: z.string().default("5").pipe(z.coerce.number()),
  yearColor: z.string().default("brown"),
  yearWeight: z.string().default("7").pipe(z.coerce.number()),
  labelSize: z.string().default("15").pipe(z.coerce.number()),
});

export function YearClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const params = YearClockParams.parse({
    weekColor: searchParams.get("w") || undefined,
    weekWeight: searchParams.get("ww") || undefined,
    monthColor: searchParams.get("m") || undefined,
    monthWeight: searchParams.get("mw") || undefined,
    yearColor: searchParams.get("y") || undefined,
    yearWeight: searchParams.get("yw") || undefined,
    labelSize: searchParams.get("ls") || undefined,
  });

  return <YearClock maxRadius={maxRadius} {...params} />;
}

const ClockParams = z.object({
  unwind: z.stringbool().default(false),
  minuteColor: z.string().default("#FFD63A"),
  hourColor: z.string().default("#6DE1D2"),
  secondColor: z.string().default("#F75A5A"),
  labelSize: z.string().default("15").pipe(z.coerce.number()),
});

export function DailyClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const params = ClockParams.parse({
    unwind: searchParams.get("unwind") || undefined,
    minuteColor: searchParams.get("m") || undefined,
    hourColor: searchParams.get("h") || undefined,
    secondColor: searchParams.get("s") || undefined,
    labelSize: searchParams.get("ls") || undefined,
  });

  return <DailyClock maxRadius={maxRadius} {...params} />;
}

const AgeParams = z.object({
  b: z.array(
    z.tuple([z.iso.date().pipe(z.coerce.date()), z.string().default("white")])
  ),
  ma: z.string().default("100").pipe(z.coerce.number()),
  ls: z.string().default("25").pipe(z.coerce.number()),
});

export function AgeClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const b = searchParams.getAll("b").map((e) => e.split("|"));
  const ma = searchParams.get("ma") || undefined;
  const ls = searchParams.get("ls") || undefined;
  const params = AgeParams.parse({ b, ma, ls });

  return (
    <React.Fragment>
      {params.b.map((p) => (
        <AgeClock
          key={p[0].toString()}
          birthday={p[0]}
          color={p[1]}
          maxRadius={maxRadius}
          maxAge={params.ma}
          labelSize={params.ls}
        />
      ))}
    </React.Fragment>
  );
}

export function App() {
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );
  const maxRadius =
    Math.min(windowDimensions.height, windowDimensions.width) / 2;
  const [searchParams] = useSearchParams();
  const background = searchParams.get("bg") || "white";

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{ background, width: "100%", height: "100vh", display: "flex" }}
    >
      <svg
        width={maxRadius * 2}
        height={maxRadius * 2}
        style={{ background: "none", display: "block", margin: "auto" }}
      >
        <Outlet context={{ maxRadius: maxRadius }} />
      </svg>
    </div>
  );
}

export default App;
