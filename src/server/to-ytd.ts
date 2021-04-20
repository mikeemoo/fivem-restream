import fs from "fs";
import path from "path";

const RESOURCE_IDENT = 0x37435352;
const VERSION = 13;

export default async (ddsBuffer: Buffer): Promise<Buffer> => {

  const ytd = Buffer.alloc(10000, 0, 'binary');

  const rootPath = GetResourcePath(GetCurrentResourceName());
  const sample = fs.readFileSync(path.join(rootPath, `samples/created-with-texturetoolkit.ytd`));

  let offset = 0;
  ytd.writeUInt32LE(RESOURCE_IDENT, offset++ * 4);
  ytd.writeUInt32LE(VERSION, offset++ * 4);

  for (let i = 0; i < 12; i++) {
    console.log(`${Math.floor(i / 4)}: ${sample[i]} ${ytd[i]}`);
  }

  return ddsBuffer;
}