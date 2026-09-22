import { useEffect, useMemo, useState } from "react";
import { IconClose, IconSearch } from "../icons/Icons.jsx";

const destinations = [
  { name: "Nearby", subtitle: "Find what's around you" },
  { name: "North Goa, Goa", subtitle: "Popular beach destination" },
  { name: "Mumbai, Maharashtra", subtitle: "For sights like Gateway of India" },
  { name: "Udaipur, Rajasthan", subtitle: "For its stunning architecture" },
  { name: "Lonavala, Maharashtra", subtitle: "For nature lovers" },
  { name: "South Goa, Goa", subtitle: "Popular beach destination" },
  { name: "Dubai, United Arab Emirates", subtitle: "For sights like Burj Khalifa" },
];

function formatDateRange(checkIn, checkOut) {
  if (!checkIn) return "Add dates";
  const start = `${checkIn.getDate()} ${checkIn.toLocaleString("en-US", { month: "short" })}`;
  if (!checkOut) return start;
  return `${start} - ${checkOut.getDate()} ${checkOut.toLocaleString("en-US", { month: "short" })}`;
}

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: start }, () => null);
  for (let d = 1; d <= days; d += 1) cells.push(d);
  return cells;
}

export function SearchBar({ compact = false }) {
  const [open, setOpen] = useState(null);
  const [where, setWhere] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [checkIn, setCheckIn] = useState(new Date(2026, 6, 1));
  const [checkOut, setCheckOut] = useState(new Date(2026, 6, 3));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const guestTotal = guests.adults + guests.children;
  const guestLabel = useMemo(() => `${guestTotal} guest${guestTotal === 1 ? "" : "s"}`, [guestTotal]);
  const dateLabel = formatDateRange(checkIn, checkOut);
  const close = () => setOpen(null);
  const toggle = (id) => setOpen((current) => (current === id ? null : id));

  if (compact) {
    return (
      <button
        type="button"
        className="flex h-12 cursor-pointer items-center gap-3 rounded-full border border-hairline bg-white px-2 shadow-search"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span className="pl-3 text-sm font-semibold">Anywhere</span>
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

  return (
    <div className="relative mx-auto w-full max-w-[850px]">
      <div
        className={`flex h-[64px] items-center rounded-full ${
          open ? "bg-[#EBEBEB]" : "border border-[#DDDDDD] bg-white shadow-search"
        }`}
      >
        <Field
          label="Where"
          value={where || "Search destinations"}
          active={open === "where"}
          idle={!open}
          onClick={() => toggle("where")}
        />
        {!open && <span className="h-8 w-px shrink-0 bg-[#DDDDDD]" />}
        <Field
          label="When"
          value={dateLabel}
          active={open === "when"}
          idle={!open}
          onClick={() => toggle("when")}
        />
        {!open && <span className="h-8 w-px shrink-0 bg-[#DDDDDD]" />}

        <div
          className={`flex h-[64px] min-w-[280px] items-center ${
            open === "who" ? "rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]" : ""
          }`}
        >
          <Field
            label="Who"
            value={guestLabel}
            muted={guestTotal === 1 && !open}
            active={open === "who"}
            idle={!open}
            nested={open === "who"}
            onClick={() => toggle("who")}
          />
          {open && (
            <button
              type="button"
              aria-label="Close search"
              onClick={close}
              className="mr-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#222] hover:bg-[#EBEBEB]"
            >
              <IconClose className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className={`mr-2 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-active ${
              open ? "h-12 gap-2 px-7" : "h-12 w-12"
            }`}
            aria-label="Search"
          >
            <IconSearch className="h-4 w-4" />
            {open && <span className="text-[16px] font-semibold">Search</span>}
          </button>
        </div>
      </div>

      {open === "where" && (
        <div className="absolute left-0 top-[76px] z-40 w-[430px] rounded-[32px] bg-white p-8 shadow-card animate-fade-scale">
          <p className="mb-4 text-xs font-semibold">Suggested destinations</p>
          <ul className="space-y-1">
            {destinations.map((d) => (
              <li key={d.name}>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-2 py-2 text-left hover:bg-surface-soft"
                  onClick={() => {
                    setWhere(d.name);
                    setOpen("when");
                  }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-strong text-lg">
                    {d.name === "Nearby" ? "✈️" : "📍"}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{d.name}</span>
                    <span className="block text-sm text-muted">{d.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open === "when" && (
        <div className="absolute left-1/2 top-[76px] z-40 w-[780px] -translate-x-1/2 rounded-[32px] bg-white p-8 shadow-card animate-fade-scale">
          <MiniCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onPick={(date) => {
              if (!checkIn || (checkIn && checkOut)) {
                setCheckIn(date);
                setCheckOut(null);
              } else if (date > checkIn) {
                setCheckOut(date);
              } else {
                setCheckIn(date);
                setCheckOut(null);
              }
            }}
          />
        </div>
      )}

      {open === "who" && (
        <div className="absolute right-0 top-[76px] z-40 w-[406px] rounded-[32px] bg-white px-8 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.14)] animate-fade-scale">
          {[
            ["Adults", "Ages 13 or above", "adults"],
            ["Children", "Ages 2–12", "children"],
            ["Infants", "Under 2", "infants"],
            ["Pets", "Bringing a service animal?", "pets"],
          ].map(([title, sub, key], i) => (
            <div key={key} className={`flex items-center justify-between py-[22px] ${i ? "border-t border-[#EBEBEB]" : ""}`}>
              <div>
                <p className="text-[16px] font-semibold">{title}</p>
                <p className="text-[14px] text-[#6A6A6A]">{sub}</p>
              </div>
              <Stepper
                value={guests[key]}
                min={key === "adults" ? 1 : 0}
                onChange={(v) => setGuests((g) => ({ ...g, [key]: v }))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onClick, active, idle, muted, nested }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[64px] min-w-0 flex-1 cursor-pointer px-8 text-left ${
        active && !nested ? "rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]" : ""
      } ${idle ? "hover:bg-[#EBEBEB] hover:rounded-full" : ""}`}
    >
      <div className="text-[12px] font-semibold leading-4">{label}</div>
      <div className={`truncate text-[14px] leading-5 ${muted ? "text-[#717171]" : "text-[#222]"}`}>{value}</div>
    </button>
  );
}

function Stepper({ value, min = 0, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <RoundBtn disabled={value <= min} onClick={() => onChange(value - 1)} label="Decrease">
        –
      </RoundBtn>
      <span className="w-5 text-center text-[16px]">{value}</span>
      <RoundBtn onClick={() => onChange(value + 1)} label="Increase">
        +
      </RoundBtn>
    </div>
  );
}

function RoundBtn({ children, disabled, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#B0B0B0] text-[18px] leading-none text-[#717171] disabled:cursor-default disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function MiniCalendar({ checkIn, checkOut, onPick }) {
  const [base, setBase] = useState(new Date(2026, 6, 1));
  const months = [0, 1].map((i) => new Date(base.getFullYear(), base.getMonth() + i, 1));
  return (
    <div>
      <div className="mb-4 flex justify-center gap-2 text-sm">
        <span className="rounded-full bg-ink px-4 py-2 font-semibold text-white">Dates</span>
        <span className="rounded-full px-4 py-2 text-ink">Flexible</span>
      </div>
      <div className="grid grid-cols-2 gap-10">
        {months.map((m) => (
          <div key={m.toISOString()}>
            <p className="mb-3 text-center font-semibold">
              {m.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-muted">
              {"SMTWTFS".split("").map((d, i) => (
                <div key={`${d}-${i}`}>{d}</div>
              ))}
              {monthMatrix(m.getFullYear(), m.getMonth()).map((day, i) => {
                const date = day ? new Date(m.getFullYear(), m.getMonth(), day) : null;
                const selected =
                  date &&
                  ((checkIn && date.toDateString() === checkIn.toDateString()) ||
                    (checkOut && date.toDateString() === checkOut.toDateString()));
                const inRange = date && checkIn && checkOut && date > checkIn && date < checkOut;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!day}
                    onClick={() => date && onPick(date)}
                    className={`h-9 w-9 cursor-pointer justify-self-center rounded-full text-sm disabled:cursor-default ${selected ? "bg-ink text-white" : inRange ? "bg-surface-strong" : "hover:border hover:border-ink"}`}
                  >
                    {day || ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
