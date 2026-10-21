import { lazy, type ComponentType } from "react";

// After a deploy, an already-open page can request lazy chunks that no longer exist.
// Reload once to pick up the new build instead of leaving the page half-initialised.
const RELOAD_KEY = "chunk-reload-at";

export function reloadForNewBuild(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    // One reload per 5 minutes is enough to pick up a new build and can never loop
    if (Date.now() - last < 5 * 60_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* storage unavailable: reload anyway */
  }
  window.location.reload();
  return true;
}

export function lazyWithReload<T extends ComponentType<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  factory: () => Promise<{ default: T }>
) {
  return lazy(() =>
    factory().catch((error) => {
      // While the reload is in flight, never resolve so nothing renders an error
      if (reloadForNewBuild()) return new Promise<{ default: T }>(() => {});
      throw error;
    })
  );
}

// Persistent flag so a Navbar/Lenis that mounts later still starts scrolling
export function unlockScroll() {
  document.documentElement.dataset.scrollUnlocked = "1";
  document.body.style.overflowY = "auto";
  window.dispatchEvent(new Event("app:unlock-scroll"));
}
