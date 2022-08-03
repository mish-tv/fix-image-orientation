import "expect-puppeteer";

import * as path from "path";
import { promises as fs } from "fs";

import { imgDiff } from "img-diff-js";
import pLimit from "p-limit";

import { isExists } from "./test/fs";

declare const imageFileToOrientationFixedDataURL: (file: Blob) => Promise<string>;
const tmpDir = path.join(__dirname, "../tmp");

const addScriptLimit = pLimit(1);
let scriptAdded = false;
const addScript = () =>
  addScriptLimit(async () => {
    if (scriptAdded) return;
    scriptAdded = true;
    await page.addScriptTag({ path: path.join(__dirname, "../lib/bundle/browser.js") });
  });

const dataURLRegex = /^data:.+\/(.+);base64,(.*)$/;
const getFixedBuffer = async (testImageFile: string) => {
  const buffer = [...(await fs.readFile(path.join(__dirname, "../test", testImageFile)))];

  await addScript();
  const dataURL = await page.evaluate(async (buffer: number[]) => {
    const blob = new Blob([new Uint8Array(buffer).buffer]);

    return imageFileToOrientationFixedDataURL(blob);
  }, buffer);

  return Buffer.from(dataURL.match(dataURLRegex)![2], "base64");
};

const limitsByTestImageFile: Record<string, pLimit.Limit | undefined> = {};
const getLimitByTestImageFile = (testImageFile: string): pLimit.Limit => {
  const tmp = limitsByTestImageFile[testImageFile];
  if (tmp != undefined) return tmp;

  const limit = pLimit(1);
  limitsByTestImageFile[testImageFile] = limit;

  return limit;
};

const writeFixedBufferToTmpFile = (testImageFile: string) => {
  const out = path.join(tmpDir, testImageFile);

  const limit = getLimitByTestImageFile(testImageFile);

  return limit(async () => {
    if (await isExists(out)) return out;

    const buffer = await getFixedBuffer(testImageFile);
    await fs.writeFile(out, buffer);

    return out;
  });
};

const compare = async (a: string, b: string) => {
  const [outA, outB] = await Promise.all([writeFixedBufferToTmpFile(a), writeFixedBufferToTmpFile(b)]);
  const result = await imgDiff({ actualFilename: outA, expectedFilename: outB });

  return result.imagesAreSame;
};

const testCases: [string, string][] = [
  ["1.png", "2.png"],
  ["1.png", "3.png"],
  ["1.png", "4.png"],
  ["1.png", "5.png"],
  ["1.png", "6.png"],
  ["1.png", "7.png"],
  ["1.png", "8.png"],
  ["1.jpeg", "2.jpeg"],
];

jest.setTimeout(100_000);
describe("imageFileToOrientationFixedDataURL", () => {
  it("returns orientation fixed data url.", async () => {
    if (await isExists(tmpDir)) await fs.rm(tmpDir, { recursive: true });
    await fs.mkdir(tmpDir);

    const results = await Promise.all(testCases.map(([a, b]) => compare(a, b)));
    const expected = new Array<boolean>(testCases.length);
    expected.fill(true);
    expect(results).toEqual(expected);
  });
});
