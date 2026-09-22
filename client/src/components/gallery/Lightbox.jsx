import { useEffect, useRef, useState } from "react";
import { IconChevron, IconHeart, IconShare } from "../icons/Icons.jsx";

export function Lightbox({ photos, index, onClose, onIndexChange }) {
  const [dir, setDir] = useState(0);
  const [saved, setSaved] = useState(false);
  const closeRef = useRef(null);
  const photo = photos[index];

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index]);

  const go = (delta) => {
    const next = (index + delta + photos.length) % photos.length;
    setDir(delta);
    onIndexChange(next);
  };

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-white" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className="flex h-20 items-center justify-between px-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft"
          aria-label="Close photo viewer"
        >
          <IconChevron dir="left" className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium">
          {index + 1} / {photos.length}
        </p>
        <div className="flex items-center gap-2">
          <IconTextBtn label="Share">
            <IconShare className="h-4 w-4" /> Share
          </IconTextBtn>
          <IconTextBtn label={saved ? "Saved" : "Save"} onClick={() => setSaved((s) => !s)}>
            <IconHeart filled={saved} className="h-4 w-4" /> Save
          </IconTextBtn>
        </div>
      </div>

      <div className="relative flex h-[calc(100vh-80px)] items-center justify-center px-24">
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-8 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white shadow-airbnb hover:scale-105"
          aria-label="Previous photo"
        >
          <IconChevron dir="left" className="h-4 w-4" />
        </button>
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.roomLabel || "Listing photo"}
          className={`max-h-[82vh] max-w-[min(1100px,80vw)] rounded-xl object-contain ${dir >= 0 ? "animate-slide-right" : "animate-slide-left"}`}
        />
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-8 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white shadow-airbnb hover:scale-105"
          aria-label="Next photo"
        >
          <IconChevron dir="right" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function IconTextBtn({ children, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline-offset-2 hover:bg-surface-soft hover:underline"
    >
      {children}
    </button>
  );
}
