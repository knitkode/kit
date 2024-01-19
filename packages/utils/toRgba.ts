// import hexRgb from "hex-rgb";

// export const toRgb = (hexColor: string) => hexRgb(hexColor, { format: "css" });

// export const toRgba = (hexColor: string, alpha: number) =>
//   hexRgb(hexColor, { format: "css", alpha });

/**
 * @category colors
 */
export function toRgba(hex: string, alpha = 1) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (r) {
    return `rgba(${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(
      r[3],
      16,
    )},${alpha})`;
  }
  return "";
}

export default toRgba;
