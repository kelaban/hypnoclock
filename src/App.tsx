import * as d3 from "d3";
import * as z from "zod";
import React from "react";
import AgeClock from "./AgeClock";
import DailyClock from "./DailyClock";
import { Outlet, useOutletContext, useSearchParams } from "react-router";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

type ContextType = { maxRadius: number };

const ClockParams = z.object({
  unwind: z.stringbool().default(true),
  minuteColor: z.string().default("#FFD63A"),
  hourColor: z.string().default("#6DE1D2"),
  secondColor: z.string().default("#F75A5A")
});

export function DailyClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const params = ClockParams.parse({
    unwind: searchParams.get("unwind") || undefined,
    minuteColor: searchParams.get("m") || undefined,
    hourColor: searchParams.get("h") || undefined,
    secondColor: searchParams.get("s") || undefined
  });

  return <DailyClock maxRadius={maxRadius} {...params} />;
}

const AgeParams = z.object({
  b: z.array(
    z.tuple([z.iso.date().pipe(z.coerce.date()), z.string().default("white")])
  ),
});

export function AgeClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const b = searchParams.getAll("b").map((e) => e.split("|"));
  const params = AgeParams.parse({ b });

  return (
    <React.Fragment>
      {params.b.map((p) => (
        <AgeClock
          key={p[0].toString()}
          birthday={p[0]}
          color={p[1]}
          maxRadius={maxRadius}
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
        <Outlet context={{ maxRadius }} />
      </svg>
    </div>
  );
}

export default App;
