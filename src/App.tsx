import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import SeoHead from "./components/SeoHead";
import SeoFooter from "./components/SeoFooter";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
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
      </Routes>
      <SeoFooter />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
