import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { IconChevron, IconHeart, IconStar } from "../icons/Icons.jsx";
import { formatRating } from "../../utils/format.js";

export function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .home()
      .then(setData)
      .catch(() => setError("Could not load homes. Is the API running?"));
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <Header mode="home" />
      <main className="mx-auto max-w-[1760px] px-20 pb-16 pt-8">
        {error && <p className="text-sm text-primary">{error}</p>}
        {!data && !error && <HomeSkeleton />}
        {data?.sections.map((section) => (
          <ListingRow key={section.id} section={section} />
        ))}
      </main>
      <Footer />
    </div>
  );
}

function ListingRow({ section }) {
  const scroller = useRef(null);
  const scroll = (dir) => {
    scroller.current?.scrollBy({ left: dir * 860, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="cursor-pointer text-[22px] font-semibold tracking-tight">
          {section.title} <span className="inline-block translate-y-[-1px]">›</span>
        </h2>
        <div className="flex gap-2">
          <IconBtn label={`Previous ${section.title}`} onClick={() => scroll(-1)}>
            <IconChevron dir="left" className="h-3 w-3" />
          </IconBtn>
          <IconBtn label={`Next ${section.title}`} onClick={() => scroll(1)}>
            <IconChevron dir="right" className="h-3 w-3" />
          </IconBtn>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth">
        {section.listings.map((listing) => (
          <PropertyCard key={listing.listingId} listing={listing} />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [index, setIndex] = useState(0);
  const images = listing.images?.length ? listing.images : [listing.cardImage];
  const photo = images[index] || listing.cardImage;

  const step = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  return (
    <article className="w-[212px] shrink-0">
      <Link to={`/listing/${listing.listingId}`} className="group block cursor-pointer">
        <div className="relative mb-2 overflow-hidden rounded-xl">
          <img src={photo} alt={listing.title} className="aspect-square w-full object-cover" />
          {listing.guestFavourite && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold shadow-airbnb">
              Guest favourite
            </span>
          )}
          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={saved}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            className="absolute right-3 top-3 cursor-pointer text-white drop-shadow"
          >
            <IconHeart filled={saved} className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => step(e, -1)}
                className="absolute left-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-airbnb group-hover:flex"
              >
                <IconChevron dir="left" className="h-3 w-3" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => step(e, 1)}
                className="absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-airbnb group-hover:flex"
              >
                <IconChevron dir="right" className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.slice(0, 5).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-medium">{listing.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-[15px]">
            <IconStar className="h-3 w-3" />
            {formatRating(listing.cardRating)}
          </span>
        </div>
        <p className="text-[15px] text-muted">{listing.cardPriceLabel}</p>
      </Link>
    </article>
  );
}

function IconBtn({ children, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-hairline hover:shadow-airbnb"
    >
      {children}
    </button>
  );
}

function HomeSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="mb-2 aspect-square rounded-xl bg-surface-strong" />
          <div className="mb-1 h-4 rounded bg-surface-strong" />
          <div className="h-4 w-2/3 rounded bg-surface-strong" />
        </div>
      ))}
    </div>
  );
}
