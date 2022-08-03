import { getAndRemoveJpegOrientation } from "./get-and-remove-jpeg-orientation";
import { getAndRemovePngOrientation } from "./get-and-remove-png-orientation";

type Exif = { type: "image/jpeg" | "image/png"; orientation: number };

export const getAndRemoveOrientation = (dataView: DataView): Exif | undefined => {
  const jpegOrientation = getAndRemoveJpegOrientation(dataView);
  if (jpegOrientation != undefined) return { type: "image/jpeg", orientation: jpegOrientation };

  const pngOrientation = getAndRemovePngOrientation(dataView);
  if (pngOrientation != undefined) return { type: "image/png", orientation: pngOrientation };

  return undefined;
};
