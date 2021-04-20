import fs from "fs";
import path from "path";

export default async (ddsBuffer) => {
  
  const ytd = Buffer.alloc(10000, 0, 'binary');

  const rootPath = GetResourcePath(GetCurrentResourceName());
  const sample = fs.readFileSync(path.join(rootPath, `samples/created-with-texturetoolkit.ytd`));
  
  for (let i = 0; i < 100; i++) {
    console.log(`${Math.floor(i / 4)}: ${sample[i]} ${ytd[i]}`);
  }

  return ddsBuffer;
}