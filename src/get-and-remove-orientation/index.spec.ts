import * as path from "path";
import { promises as fs } from "fs";
import { getAndRemoveOrientation } from "./index";

const readFile = async (path: string) => {
  const { buffer } = await fs.readFile(path);

  return new DataView(buffer);
};

describe("getAndRemoveOrientation", () => {
  it("returns orientation and mime type.", async () => {
    for (let i = 1; i <= 8; i++) {
      expect(getAndRemoveOrientation(await readFile(path.join(__dirname, "../../test", `${i}.jpeg`)))).toEqual({
        orientation: i,
        type: `image/jpeg`,
      });
      expect(getAndRemoveOrientation(await readFile(path.join(__dirname, "../../test", `${i}.png`)))).toEqual({
        orientation: i,
        type: `image/png`,
      });
    }
  });
});
