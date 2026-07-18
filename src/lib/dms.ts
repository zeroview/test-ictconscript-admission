/**
 * Returns the passed decimal coordinate formatted to degrees, minutes and seconds
 */
export const formatDMS = (decimal: number, axis: "lat" | "lon") => {
  const pad = (n: number | string, d: number) => String(n).padStart(d, "0");

  const deg = 0 | (decimal < 0 ? (decimal = -decimal) : decimal);
  const min = 0 | (((decimal += 1e-9) % 1) * 60);
  const sec = (0 | (((decimal * 60) % 1) * 6000)) / 100;
  const dir = decimal < 0 ? (axis === "lon" ? "W" : "S") : axis === "lon" ? "E" : "N";

  return `${pad(deg, 2)}°${pad(min, 2)}'${pad(sec.toFixed(1), 4)}"${dir}`;
};
