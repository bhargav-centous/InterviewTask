import { useEffect, useState } from "react";

export function useScrollFlag(enterAt, exitAt) {
  const [active, setActive] = useState(() => (typeof window !== "undefined" ? window.scrollY > enterAt : false));

  useEffect(() => {
    let ticking = false;

    const read = () => {
      const y = window.scrollY;
      setActive((prev) => {
        if (!prev && y >= enterAt) return true;
        if (prev && y <= exitAt) return false;
        return prev;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enterAt, exitAt]);

  return active;
}
