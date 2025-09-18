/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router";
import { AgeClockView, App, DailyClockView, YearClockView } from "./App";
import AgeClock from "./AgeClock";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DailyClockView />} />
          <Route path="year" element={<YearClockView />} />
          <Route path="age" element={<AgeClockView />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
