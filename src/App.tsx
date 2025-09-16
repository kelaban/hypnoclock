import * as d3 from "d3";
import * as z from "zod";
import React from "react";
import SpiralHand from "./SpiralHand";
import AgeClock from "./AgeClock";
import DailyClock from "./DailyClock";
import { Outlet, useOutletContext, useSearchParams } from "react-router";

const countSeconds = (start?: Date) =>
  d3.timeSecond.count(start ? start : d3.timeDay.floor(new Date()), new Date())


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


type ContextType = { maxRadius: number };


const ClockParams = z.object({
  unwind: z.stringbool().default(true)
})

export function DailyClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams()
  const params = ClockParams.parse({ unwind: searchParams.get("unwind") || undefined })

  return <DailyClock unwind={params.unwind} maxRadius={maxRadius} />
}

const AgeParams = z.object({
  a: z.array(
    z.tuple([
      z.iso.date().pipe(z.coerce.date()),
      z.string().default("white")]
    )
  )
})

export function AgeClockView() {
  const { maxRadius } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams()
  const a = searchParams.getAll("a").map((e) => e.split("|"))
  console.log(JSON.stringify(a))
  const params = AgeParams.parse({ a })

  return (
    <React.Fragment>
      {params.a.map(p => <AgeClock key={p[0].toString()} birthday={p[0]} color={p[1]} maxRadius={maxRadius} />)}

    </React.Fragment>
  )
}

export function App() {
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  const maxRadius = Math.min(windowDimensions.height, windowDimensions.width) / 2

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ background: "black", width: "100%", height: "100vh", display: "flex" }}>
      <svg width={maxRadius * 2} height={maxRadius * 2} style={{ background: "none", display: "block", margin: "auto" }}>
        <Outlet context={{ maxRadius }} />
      </svg>
    </div>
  );
}

export default App;
