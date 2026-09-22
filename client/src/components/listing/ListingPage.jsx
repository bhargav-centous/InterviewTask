import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { api } from "../../api/client.js";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { BookingCard } from "./BookingCard.jsx";
import { PhotoTour } from "../gallery/PhotoTour.jsx";
import { Lightbox } from "../gallery/Lightbox.jsx";
import {
  IconAc,
  IconGrid,
  IconHeart,
  IconKey,
  IconPin,
  IconShare,
  amenityIcon,
} from "../icons/Icons.jsx";
import { flattenTourPhotos, formatRating } from "../../utils/format.js";
import { useScrollFlag } from "../../hooks/useScrollFlag.js";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:52px;height:52px;border-radius:999px;background:#ff385c;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.18)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"/></svg></div>`,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
});

export function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [tourOpen, setTourOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const compactNav = useScrollFlag(720, 520);
  const [activeSection, setActiveSection] = useState("photos");
  const calendarRef = useRef(null);

  useEffect(() => {
    setListing(null);
    api
      .listing(id)
      .then(setListing)
      .catch(() => setError("Listing not found."));
  }, [id]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const ids = ["photos", "amenities", "reviews", "location"];
        let current = "photos";
        ids.forEach((sid) => {
          const el = document.getElementById(sid);
          if (el && el.getBoundingClientRect().top < 160) current = sid;
        });
        setActiveSection(current);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const photos = useMemo(() => (listing ? flattenTourPhotos(listing.photoTour) : []), [listing]);
  const amenityCount = listing?.amenities?.reduce((n, g) => n + g.items.length, 0) || 51;

  const openTour = () => setTourOpen(true);
  const jump = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <p className="px-20 py-20 text-lg">{error}</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Header mode="listing" />
        <div className="mx-auto max-w-[1120px] animate-pulse px-0 py-8">
          <div className="mb-6 h-8 w-64 rounded bg-surface-strong" />
          <div className="h-[400px] rounded-xl bg-surface-strong" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Header
        mode="listing"
        listing={listing}
        compactNav={compactNav}
        activeSection={activeSection}
        onJump={jump}
        onReserve={() => calendarRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      <main className="mx-auto max-w-[1120px] pb-16">
        <div className="flex items-start justify-between pb-6 pt-8">
          <h1 className="text-[26px] font-semibold tracking-tight">{listing.title}</h1>
          <div className="flex items-center gap-1">
            <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline-offset-2 hover:bg-surface-soft hover:underline">
              <IconShare className="h-4 w-4" /> Share
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => setSaved((s) => !s)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline-offset-2 hover:bg-surface-soft hover:underline"
            >
              <IconHeart filled={saved} className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        <section id="photos" className="relative mb-8">
          <div className="grid h-[412px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
            {listing.heroPhotos.slice(0, 5).map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={openTour}
                className={`photo-hover overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={openTour}
            className="absolute bottom-5 right-5 flex items-center gap-2 rounded-lg border border-ink bg-white px-4 py-1.5 text-sm font-semibold shadow-airbnb"
          >
            <IconGrid className="h-3.5 w-3.5" /> Show all photos
          </button>
        </section>

        <div className="mb-6 flex gap-6 border-b border-hairline-soft text-sm font-semibold text-body">
          {["Photos", "Amenities", "Reviews", "Location"].map((item) => (
            <button key={item} type="button" onClick={() => jump(item.toLowerCase())} className={`relative py-4 ${item === "Photos" ? "text-ink" : ""}`}>
              {item}
              {item === "Photos" && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-ink" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_378px] gap-20">
          <div>
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="text-[22px] font-semibold">{listing.type}</h2>
                <p className="text-[16px] text-body">
                  {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} bathrooms
                </p>
              </div>
            </div>

            {listing.guestFavourite && (
              <div className="mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-y border-hairline-soft py-6">
                <div className="flex items-center gap-3 font-semibold">
                  <Laurel />
                  <span>
                    Guest
                    <br />
                    favourite
                  </span>
                  <Laurel flip />
                </div>
                <p className="max-w-[260px] text-[15px] leading-5">One of the most loved homes on Airbnb, according to guests</p>
                <div className="border-l border-hairline-soft pl-6 text-center">
                  <div className="text-[22px] font-semibold">{Number(listing.rating).toFixed(1)}</div>
                  <div className="text-[11px] tracking-tight">★★★★★</div>
                  <button type="button" onClick={() => jump("reviews")} className="text-[13px] font-semibold underline">
                    {listing.reviewCount} Reviews
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 border-b border-hairline-soft py-6">
              <img src={listing.host.avatar} alt={listing.host.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold">Hosted by {listing.host.name}</p>
                <p className="text-sm text-muted">
                  {listing.host.isSuperhost ? "Superhost" : "Host"} · {listing.host.hostingSince}
                </p>
              </div>
            </div>

            <div className="space-y-6 border-b border-hairline-soft py-7">
              {listing.highlights.map((h) => (
                <div key={h.title} className="flex gap-4">
                  {h.icon === "ac" && <IconAc className="mt-0.5 h-6 w-6" />}
                  {h.icon === "key" && <IconKey className="mt-0.5 h-6 w-6" />}
                  {h.icon === "pin" && <IconPin className="mt-0.5 h-6 w-6" />}
                  <div>
                    <p className="font-semibold">{h.title}</p>
                    <p className="text-[15px] text-muted">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b border-hairline-soft py-8">
              <p className="max-w-[620px] text-[16px] leading-6 text-body">
                {descOpen ? listing.description : listing.description}
              </p>
              <button type="button" onClick={() => setDescOpen(true)} className="mt-3 text-[16px] font-semibold underline">
                Show more &gt;
              </button>
            </div>

            {listing.rooms?.length > 0 && (
              <div className="border-b border-hairline-soft py-10">
                <h2 className="mb-6 text-[22px] font-semibold">Where you&apos;ll sleep</h2>
                <div className="flex gap-4">
                  {listing.rooms.map((room) => (
                    <div key={room.name} className="w-[210px]">
                      <img src={room.image} alt={room.name} className="mb-3 h-[140px] w-full rounded-xl object-cover" />
                      <p className="font-semibold">{room.name}</p>
                      <p className="text-sm text-body">{room.beds}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <section id="amenities" className="border-b border-hairline-soft py-10">
              <h2 className="mb-6 text-[22px] font-semibold">What this place offers</h2>
              <div className="grid max-w-[520px] grid-cols-2 gap-y-5">
                {listing.amenityPreview.map((name) => {
                  const Icon = amenityIcon(name);
                  return (
                    <div key={name} className="flex items-center gap-4 text-[16px]">
                      <Icon className="h-6 w-6" /> {name}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setShowAllAmenities(true)}
                className="mt-8 rounded-lg border border-ink px-6 py-3 text-sm font-semibold hover:bg-surface-soft"
              >
                Show all {amenityCount} amenities
              </button>
            </section>

            <section ref={calendarRef} className="border-b border-hairline-soft py-10">
              <h2 className="text-[22px] font-semibold">1 night in {listing.location.city} City</h2>
              <p className="mb-6 text-muted">17 Jul 2026 → 18 Jul 2026</p>
              <AvailabilityCalendar />
              <button type="button" className="mt-4 text-sm font-semibold underline">
                Clear dates
              </button>
            </section>
          </div>

          <aside className="relative">
            <div className="sticky top-28">
              <BookingCard listing={listing} onOpenCalendar={() => calendarRef.current?.scrollIntoView({ behavior: "smooth" })} />
            </div>
          </aside>
        </div>

        <section id="reviews" className="border-t border-hairline-soft pt-14">
          <div className="mb-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-4 text-[72px] font-semibold leading-none">
              <Laurel large />
              {Number(listing.rating).toFixed(1)}
              <Laurel large flip />
            </div>
            <h2 className="text-[22px] font-semibold">Guest favourite</h2>
            <p className="mx-auto max-w-[360px] text-body">
              This home is a guest favourite based on ratings, reviews and reliability
            </p>
            <button type="button" className="mt-2 text-sm font-semibold underline">
              How reviews work
            </button>
          </div>

          <div className="mb-10 grid grid-cols-6 gap-4 border-b border-hairline-soft pb-8">
            {Object.entries(listing.reviewScores).map(([key, value]) => (
              <div key={key} className="border-r border-hairline-soft px-2 last:border-0">
                <p className="text-sm capitalize">{key === "checkin" ? "Check-in" : key}</p>
                <p className="text-lg font-semibold">{Number(value).toFixed(1)}</p>
              </div>
            ))}
          </div>

          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
            {listing.reviewTags.map((tag) => (
              <span key={tag.label} className="whitespace-nowrap rounded-full border border-hairline px-4 py-2 text-sm">
                {tag.label} {tag.count}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10">
            {listing.reviews.map((review) => (
              <article key={review.name}>
                <div className="mb-3 flex items-center gap-3">
                  <img src={review.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted">{review.years}</p>
                  </div>
                </div>
                <p className="mb-1 text-sm">
                  {"★".repeat(review.rating)} · {review.date}
                </p>
                <p className="text-[16px] leading-6 text-body">{review.text}</p>
                <button type="button" className="mt-2 text-sm font-semibold underline">
                  Show more
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="location" className="pt-14">
          <h2 className="mb-2 text-[22px] font-semibold">Where you&apos;ll be</h2>
          <p className="mb-6 text-body">
            {listing.location.area}, {listing.location.city}, {listing.location.country}
          </p>
          <div className="h-[380px] overflow-hidden rounded-xl">
            <MapContainer
              center={[listing.location.lat, listing.location.lng]}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='© CARTO, © OpenStreetMap contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[listing.location.lat, listing.location.lng]} icon={pinIcon} />
            </MapContainer>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-3 gap-12 border-t border-hairline-soft pt-12">
          <Thing title="House rules" items={listing.houseRules} />
          <Thing title="Safety & property" items={listing.safety} />
          <Thing title="Cancellation policy" items={listing.cancellation} />
        </section>
      </main>

      <Footer />

      {tourOpen && <PhotoTour listing={listing} onClose={() => setTourOpen(false)} />}
      {lightbox != null && (
        <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
      )}
      {showAllAmenities && (
        <AmenitiesModal listing={listing} count={amenityCount} onClose={() => setShowAllAmenities(false)} />
      )}
    </div>
  );
}

function Thing({ title, items }) {
  return (
    <div>
      <h3 className="mb-4 text-[18px] font-semibold">{title}</h3>
      <ul className="space-y-3 text-[15px] text-body">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function AmenitiesModal({ listing, count, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[75] flex items-start justify-center bg-black/40 pt-20" role="dialog" aria-modal="true">
      <div className="max-h-[80vh] w-[780px] overflow-y-auto rounded-xl bg-white p-8 shadow-card animate-fade-scale">
        <button type="button" onClick={onClose} className="mb-4 font-semibold" aria-label="Close amenities">
          ←
        </button>
        <h2 className="mb-8 text-[26px] font-semibold">What this place offers</h2>
        {listing.amenities.map((group) => (
          <div key={group.group} className="mb-8 border-b border-hairline-soft pb-6">
            <h3 className="mb-4 text-lg font-semibold">{group.group}</h3>
            <ul className="space-y-4 text-[16px]">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-sm text-muted">{count} amenities in total</p>
      </div>
    </div>
  );
}

function AvailabilityCalendar() {
  const months = [new Date(2026, 8, 1), new Date(2026, 9, 1)];
  return (
    <div className="grid grid-cols-2 gap-10">
      {months.map((m) => (
        <div key={m.toISOString()}>
          <p className="mb-3 text-center font-semibold">
            {m.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </p>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] text-muted">
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
              <div key={d}>{d}</div>
            ))}
            {buildMonth(m.getFullYear(), m.getMonth()).map((day, i) => (
              <button
                key={i}
                type="button"
                disabled={!day}
                className="h-9 w-9 justify-self-center rounded-full text-sm hover:border hover:border-ink disabled:invisible"
              >
                {day || ""}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function buildMonth(year, month) {
  const start = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return [...Array(start).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

function Laurel({ flip, large }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${large ? "h-10 w-10" : "h-7 w-7"} ${flip ? "scale-x-[-1]" : ""}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8.4 27.2c3.8-1.6 6.6-5.3 7.1-9.7.6 4.6 3.6 8.5 7.6 10.1-3.7 1.8-8.1 1.9-11.8.2-1.1-.5-2.1-1.1-2.9-1.8v1.2zM7 16.4C7 10.8 10.6 6 15.7 4.6 11.7 7 9.2 11.5 9.2 16.4c0 1.4.2 2.8.6 4.1C8.6 19.2 7.6 17.9 7 16.4zm18 0c-.6 1.5-1.6 2.8-2.8 4.1.4-1.3.6-2.7.6-4.1 0-4.9-2.5-9.4-6.5-11.8C21.4 6 25 10.8 25 16.4z"
      />
    </svg>
  );
}

