import "expect-puppeteer";

import * as fs from "fs";
import * as path from "path";

declare const imageFileToOrientationFixedDataURL: (file: Blob) => Promise<string>;

let scriptAdded = false;
const runImageFileToOrientationFixedDataURLOnBrowser = async (file: string) => {
  const buffer = [...fs.readFileSync(file)];

  if (!scriptAdded) {
    await page.addScriptTag({ path: path.join(__dirname, "../lib/bundle/browser.js") });
    scriptAdded = true;
  }

  return page.evaluate(async (buffer: number[]) => {
    const blob = new Blob([new Uint8Array(buffer).buffer]);

    return imageFileToOrientationFixedDataURL(blob);
  }, buffer);
};

describe("dummy", () => {
  it("is dummy", async () => {
    const url0 = await runImageFileToOrientationFixedDataURLOnBrowser(path.join(__dirname, "../test/1.jpeg"));
    const url1 = await runImageFileToOrientationFixedDataURLOnBrowser(path.join(__dirname, "../test/2.jpeg"));
    console.info(url0 === url1);
  });
});
