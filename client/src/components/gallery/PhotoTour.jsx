import { useEffect, useRef, useState } from "react";
import { IconChevron, IconHeart, IconShare } from "../icons/Icons.jsx";
import { flattenTourPhotos } from "../../utils/format.js";
import { Lightbox } from "./Lightbox.jsx";

export function PhotoTour({ listing, onClose }) {
  const [saved, setSaved] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [more, setMore] = useState({});
  const closeRef = useRef(null);
  const photos = flattenTourPhotos(listing.photoTour);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && lightbox == null) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, onClose]);

  const jump = (id) => {
    document.getElementById(`tour-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-white animate-fade-in" role="dialog" aria-modal="true" aria-label="Photo tour">
      <div className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white px-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft"
          aria-label="Close photo tour"
        >
          <IconChevron dir="left" className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline-offset-2 hover:bg-surface-soft hover:underline">
            <IconShare className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline-offset-2 hover:bg-surface-soft hover:underline"
          >
            <IconHeart filled={saved} className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-8 pb-24">
        <h1 className="mb-8 text-[26px] font-semibold">Photo tour</h1>
        <div className="mb-14 flex flex-wrap gap-x-4 gap-y-6">
          {listing.photoTour.map((room) => (
            <button key={room.id} type="button" onClick={() => jump(room.id)} className="w-[124px] text-left">
              <img src={room.thumb} alt="" className="mb-2 h-[78px] w-full rounded-[12px] object-cover" />
              <span className="text-[13px] font-medium leading-tight">{room.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {listing.photoTour.map((room) => (
            <section key={room.id} id={`tour-${room.id}`} className="grid grid-cols-[280px_1fr] items-start gap-12">
              <div className="sticky top-28">
                <h2 className="mb-3 text-[22px] font-semibold">{room.label}</h2>
                <p className="text-[15px] leading-6 text-body">
                  {more[room.id] || room.description.length < 90
                    ? room.description
                    : `${room.description.slice(0, 88)}...`}
                </p>
                {room.description.length >= 90 && (
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold underline"
                    onClick={() => setMore((m) => ({ ...m, [room.id]: !m[room.id] }))}
                  >
                    {more[room.id] ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {room.photos.map((src, i) => {
                  const wide = i === 0 || room.photos.length === 1;
                  const globalIndex = photos.findIndex((p) => p.roomId === room.id && p.index === i);
                  return (
                    <button
                      key={`${room.id}-${i}`}
                      type="button"
                      onClick={() => setLightbox(Math.max(0, globalIndex))}
                      className={`photo-hover overflow-hidden rounded-[16px] ${wide ? "col-span-2" : ""}`}
                    >
                      <img src={src} alt={`${room.label} photo ${i + 1}`} className={`w-full object-cover ${wide ? "h-[420px]" : "h-[250px]"}`} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {lightbox !== null && lightbox >= 0 && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onIndexChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
