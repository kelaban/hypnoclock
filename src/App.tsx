import * as d3 from "d3";
import React from "react";
import SpiralHand from "./SpiralHand";
import AgeClock from "./AgeClock";
import DailyClock from "./DailyClock";

const countSeconds = (start?: Date) =>
  d3.timeSecond.count(start ? start : d3.timeDay.floor(new Date()), new Date())


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
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
        <DailyClock unwind maxRadius={maxRadius} />
        {/* <AgeClock birthday={new Date("1990-03-17")} maxRadius={maxRadius} />
        <AgeClock birthday={new Date("1990-07-29")} maxRadius={maxRadius} color={"#FFD63A"}/>
        <AgeClock birthday={new Date("2025-01-31")} maxRadius={maxRadius} color={"#6DE1D2"}/> */}
      </svg>
    </div>
  );
}

export default App;
