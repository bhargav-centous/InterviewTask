const columns = [
  {
    title: "Support",
    links: ["Help Center", "AirCover", "Anti-discrimination", "Disability support", "Cancellation options", "Report neighborhood concern"],
  },
  {
    title: "Hosting",
    links: ["Airbnb your home", "AirCover for Hosts", "Hosting resources", "Community forum", "Hosting responsibly", "Airbnb-friendly apartments"],
  },
  {
    title: "Airbnb",
    links: ["Newsroom", "New features", "Careers", "Investors", "Gift cards", "Airbnb.org emergency stays"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline-soft bg-surface-soft">
      <div className="mx-auto max-w-[1760px] px-20 py-12">
        <div className="grid grid-cols-3 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-ink hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-hairline-soft">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between px-20 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-ink">
            <span>© 2026 Airbnb, Inc.</span>
            {["Privacy", "Terms", "Sitemap", "UK Modern Slavery Act"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span>·</span>
                <a href="#" className="hover:underline">
                  {item}
                </a>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5 font-semibold">
            <button type="button" className="hover:underline">
              English (US)
            </button>
            <button type="button" className="hover:underline">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
