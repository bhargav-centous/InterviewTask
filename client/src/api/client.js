const API = "/api";

async function getJson(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  health: () => getJson("/health"),
  home: () => getJson("/home"),
  listing: (id) => getJson(`/listings/${id}`),
};
