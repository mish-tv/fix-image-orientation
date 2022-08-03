import { promises as fs, PathLike } from "fs";
import { isNativeError } from "util/types";

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => isNativeError(error);

export const isExists = async (path: PathLike) => {
  try {
    await fs.access(path);

    return true;
  } catch (err) {
    if (isErrnoException(err) && err.code === "ENOENT") return false;
    throw err;
  }
};
