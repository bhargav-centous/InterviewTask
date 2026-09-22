import { useState } from "react";
import { IconChevron, IconDiamond, IconFlag } from "../icons/Icons.jsx";
import { formatInr } from "../../utils/format.js";

export function BookingCard({ listing, onOpenCalendar }) {
  const [openGuests, setOpenGuests] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const totalGuests = guests.adults + guests.children;

  return (
    <div className="space-y-4">
      {listing.isRareFind && (
        <div className="flex items-center gap-3 rounded-xl border border-hairline-soft px-5 py-4">
          <IconDiamond className="h-6 w-6 text-[#460479]" />
          <p className="text-[15px] font-medium">Rare find! This place is usually booked.</p>
        </div>
      )}

      <div className="rounded-xl border border-hairline p-6 shadow-card">
        <p className="mb-6 text-[22px] font-semibold">
          {formatInr(listing.pricePerNight)} <span className="text-base font-normal">/ night</span>
        </p>
        <div className="overflow-hidden rounded-lg border border-ink">
          <div className="grid grid-cols-2 border-b border-ink">
            <button type="button" onClick={onOpenCalendar} className="border-r border-ink px-3 py-2.5 text-left">
              <div className="text-[10px] font-extrabold tracking-wider">CHECK-IN</div>
              <div className="text-sm text-muted">Add date</div>
            </button>
            <button type="button" onClick={onOpenCalendar} className="px-3 py-2.5 text-left">
              <div className="text-[10px] font-extrabold tracking-wider">CHECKOUT</div>
              <div className="text-sm text-muted">Add date</div>
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              onClick={() => setOpenGuests((o) => !o)}
              aria-expanded={openGuests}
            >
              <span>
                <div className="text-[10px] font-extrabold tracking-wider">GUESTS</div>
                <div className="text-sm">{totalGuests} guest{totalGuests === 1 ? "" : "s"}</div>
              </span>
              <IconChevron dir="down" className="h-3 w-3" />
            </button>
            {openGuests && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-hairline bg-white p-4 shadow-card">
                {[["Adults", "adults"], ["Children", "children"], ["Infants", "infants"]].map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">{label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="h-7 w-7 rounded-full border border-border-strong disabled:opacity-30"
                        disabled={key === "adults" ? guests[key] <= 1 : guests[key] <= 0}
                        onClick={() => setGuests((g) => ({ ...g, [key]: g[key] - 1 }))}
                      >
                        –
                      </button>
                      <span className="w-4 text-center text-sm">{guests[key]}</span>
                      <button
                        type="button"
                        className="h-7 w-7 rounded-full border border-border-strong"
                        onClick={() => setGuests((g) => ({ ...g, [key]: g[key] + 1 }))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="button" className="mt-3 w-full rounded-lg bg-surface-strong py-3 text-sm font-semibold">
          Free cancellation available
        </button>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-primary py-3.5 text-[16px] font-semibold text-white transition hover:bg-primary-active"
        >
          Check availability
        </button>
        <p className="mt-3 text-center text-sm text-body">You won&apos;t be charged yet</p>
      </div>

      <button type="button" className="mx-auto flex items-center gap-2 text-sm font-semibold underline">
        <IconFlag className="h-4 w-4" /> Report this listing
      </button>
    </div>
  );
}
