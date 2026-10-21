import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Loading from "../components/Loading";
import { reloadForNewBuild, unlockScroll } from "../utils/chunkReload";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading when the 3D character is not rendered (see MainContainer)
    if (window.innerWidth <= 1024) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  // Stable context value so consumers don't re-render on every progress tick
  const value = useMemo(() => ({ isLoading, setIsLoading, setLoading }), [isLoading]);
  useEffect(() => {
    // Auto-start animations when the 3D model (and its loader) is skipped
    if (window.innerWidth <= 1024) {
      import("../components/utils/initialFX")
        .then((module) => {
          setTimeout(() => module.initialFX?.(), 100);
        })
        .catch(() => {
          // Chunk missing after a deploy: reload once, otherwise unlock scrolling without the intro FX
          if (reloadForNewBuild()) return;
          unlockScroll();
        });
    }
  }, []);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
