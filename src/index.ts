import { getAndRemoveOrientation } from "./get-and-remove-orientation";
import { readFileAsArrayBuffer, readFileAsDataURL } from "./file";

const noTransformOrientations = new Set([0, 1]);
const reversedAspectRatioOrientations = new Set([5, 6, 7, 8]);
const transformsByOrientation: Record<number, (image: HTMLImageElement, context: CanvasRenderingContext2D) => void> = {
  2: (image, context) => context.transform(-1, 0, 0, 1, image.width, 0),
  3: (image, context) => context.transform(-1, 0, 0, -1, image.width, image.height),
  4: (image, context) => context.transform(1, 0, 0, -1, 0, image.height),
  5: (_image, context) => context.transform(0, 1, 1, 0, 0, 0),
  6: (image, context) => context.transform(0, 1, -1, 0, image.height, 0),
  7: (image, context) => context.transform(0, -1, -1, 0, image.height, image.width),
  8: (image, context) => context.transform(0, -1, 1, 0, 0, image.width),
};

const createImage = (src: string) => {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = src;
  });
};

const createTransformedDataURL = async (blob: Blob, orientation: number, type: string) => {
  if (noTransformOrientations.has(orientation)) return readFileAsDataURL(blob);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (context == undefined) throw new Error("undefined context");

  const objectURL = URL.createObjectURL(blob);
  const image = await createImage(objectURL);

  if (reversedAspectRatioOrientations.has(orientation)) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }
  transformsByOrientation[orientation](image, context);
  context.drawImage(image, 0, 0);

  const url = canvas.toDataURL(type);

  URL.revokeObjectURL(objectURL);

  return url;
};

export const imageFileToOrientationFixedDataURL = async (file: Blob) => {
  const buffer = await readFileAsArrayBuffer(file);
  const exif = getAndRemoveOrientation(new DataView(buffer));

  if (exif == undefined) return readFileAsDataURL(file);

  const blob = new Blob([buffer], { type: exif.type });

  return createTransformedDataURL(blob, exif.orientation, exif.type);
};
