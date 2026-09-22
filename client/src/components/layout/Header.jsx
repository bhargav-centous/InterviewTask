import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AirbnbWordmark,
  IconBell,
  IconGlobe,
  IconHome,
  IconMenu,
  IconBalloon,
  IconSearch,
  IconTinyHome,
} from "../icons/Icons.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { formatInr, formatRating } from "../../utils/format.js";
import { useScrollFlag } from "../../hooks/useScrollFlag.js";

export function Header({ mode = "home", listing, onReserve, compactNav, activeSection, onJump }) {
  const scrolled = useScrollFlag(160, 12);
  const listingCompact = Boolean(compactNav);
  const collapsed = scrolled && !listingCompact;

  return (
    <header className="sticky top-0 z-50 border-b border-hairline-soft bg-canvas">
      <div className="flex h-20 items-center justify-between px-20">
        <Link to="/" className="flex min-w-[160px] cursor-pointer items-center text-primary" aria-label="Airbnb homepage">
          <AirbnbWordmark className="h-8 w-[102px] fill-current" />
        </Link>

        <div className="relative flex h-20 min-w-[420px] flex-1 items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              listingCompact ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <nav className="flex items-center gap-6 text-sm font-semibold" aria-label="Listing sections">
              {["Photos", "Amenities", "Reviews", "Location"].map((item) => {
                const id = item.toLowerCase();
                const active = activeSection === id;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onJump?.(id)}
                    className={`relative cursor-pointer py-5 ${active ? "text-ink" : "text-body hover:text-ink"}`}
                  >
                    {item}
                    {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-ink" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              !listingCompact && collapsed ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <CompactSearchPill />
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              !listingCompact && !collapsed ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <CategoryTabs />
          </div>
        </div>

        <div className="relative flex min-w-[220px] items-center justify-end">
          <div
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              listingCompact && listing ? "opacity-100" : "pointer-events-none absolute opacity-0"
            }`}
          >
            {listing && (
              <>
                <div className="text-right leading-tight">
                  <div className="text-sm font-semibold">
                    {formatInr(listing.pricePerNight * 2 + Math.round(listing.pricePerNight * 0.2))}{" "}
                    <span className="font-normal">for 2 nights</span>
                  </div>
                  <div className="text-xs text-body">
                    ★ {formatRating(listing.rating)} · {listing.reviewCount} reviews
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onReserve}
                  className="cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-active"
                >
                  Reserve
                </button>
              </>
            )}
          </div>
          <div
            className={`flex items-center gap-1 transition-opacity duration-300 ${
              listingCompact && listing ? "pointer-events-none absolute opacity-0" : "opacity-100"
            }`}
          >
            <button type="button" className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold hover:bg-surface-soft">
              Become a host
            </button>
            <button type="button" className="cursor-pointer rounded-full p-3 hover:bg-surface-soft" aria-label="Choose a language">
              <IconGlobe className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-surface-soft"
              aria-label="Main navigation menu"
            >
              <IconMenu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed || listingCompact ? "max-h-0 opacity-0" : "max-h-[92px] px-20 pb-5 opacity-100"
        }`}
      >
        <SearchBar compact={false} />
      </div>
    </header>
  );
}

function CompactSearchPill() {
  return (
    <button
      type="button"
      className="flex h-12 cursor-pointer items-center gap-3 rounded-full border border-hairline bg-white px-2 shadow-search"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Open search"
    >
      <span className="ml-2 flex h-7 w-7 items-center justify-center text-ink">
        <IconTinyHome className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold">Anywhere</span>
      <span className="h-5 w-px bg-hairline" />
      <span className="text-sm font-semibold">Jul 17 – Jul 18</span>
      <span className="h-5 w-px bg-hairline" />
      <span className="text-sm text-muted">1 guest</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        <IconSearch className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

function CategoryTabs() {
  const [active, setActive] = useState("homes");
  const tabs = [
    { id: "homes", label: "Homes", Icon: IconHome },
    { id: "experiences", label: "Experiences", Icon: IconBalloon, badge: "NEW" },
    { id: "services", label: "Services", Icon: IconBell, badge: "NEW" },
  ];
  return (
    <div className="flex items-end gap-10">
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className="relative flex cursor-pointer flex-col items-center gap-1 pb-2"
          >
            <span className="relative">
              <tab.Icon
                filled={tab.id === "homes" && selected}
                className={`h-8 w-8 ${selected ? "text-ink" : "text-muted"}`}
              />
              {tab.badge && (
                <span className="absolute -right-7 -top-1.5 rounded-[4px] bg-[#461d3c] px-1 py-px text-[8px] font-extrabold uppercase tracking-[0.4px] text-white">
                  {tab.badge}
                </span>
              )}
            </span>
            <span className={`text-sm ${selected ? "font-semibold text-ink" : "font-medium text-muted"}`}>{tab.label}</span>
            {selected && <span className="absolute bottom-0 h-[2.5px] w-8 rounded-full bg-ink" />}
          </button>
        );
      })}
    </div>
  );
}
