import { useEffect, useState } from "react";

// --- 1) хук для брейкпоінта lg (1024px)
function useIsLg() {
  const [isLg, setIsLg] = useState<boolean>(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsLg("matches" in e ? e.matches : (e as MediaQueryList).matches);
    onChange(mql);
    mql.addEventListener?.(
      "change",
      onChange as (e: MediaQueryListEvent) => void
    );
    return () =>
      mql.removeEventListener?.(
        "change",
        onChange as (e: MediaQueryListEvent) => void
      );
  }, []);
  return isLg;
}
export default useIsLg;
