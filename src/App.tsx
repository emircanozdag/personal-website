import { Suspense } from "react";
import { lazyWithReload } from "./utils/chunkReload";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import SeoHead from "./components/SeoHead";
import SeoFooter from "./components/SeoFooter";
import "./App.css";

const CharacterModel = lazyWithReload(() => import("./components/Character"));
const MainContainer = lazyWithReload(() => import("./components/MainContainer"));
const MyWorks = lazyWithReload(() => import("./pages/MyWorks"));
const Play = lazyWithReload(() => import("./pages/Play"));
const Admin = lazyWithReload(() => import("./pages/Admin"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SeoHead page="home" />
              <LoadingProvider>
                <Suspense>
                  <MainContainer>
                    <Suspense>
                      <CharacterModel />
                    </Suspense>
                  </MainContainer>
                </Suspense>
              </LoadingProvider>
            </>
          }
        />
        <Route
          path="/myworks"
          element={
            <>
              <SeoHead page="myworks" />
              <Suspense fallback={<div>Loading...</div>}>
                <MyWorks />
              </Suspense>
            </>
          }
        />
        <Route
          path="/play"
          element={
            <>
              <SeoHead page="play" />
              <Suspense fallback={<div>Loading...</div>}>
                <Play />
              </Suspense>
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <meta name="robots" content="noindex,nofollow" />
              <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0f" }} />}>
                <Admin />
              </Suspense>
            </>
          }
        />
      </Routes>
      <SeoFooter />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
