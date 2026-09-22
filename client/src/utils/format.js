export function formatInr(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function formatRating(value) {
  return Number(value).toFixed(2).replace(/\.00$/, ".0").replace(/(\.\d)0$/, "$1");
}

export function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

export function formatShortDate(date) {
  if (!date) return "Add date";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function flattenTourPhotos(photoTour = []) {
  return photoTour.flatMap((room) =>
    room.photos.map((src, index) => ({
      src,
      roomId: room.id,
      roomLabel: room.label,
      index,
    }))
  );
}
