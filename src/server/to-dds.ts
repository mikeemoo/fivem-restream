import dxt from 'dxt-js';
import pixels from 'image-pixels';
import { Buffer } from 'buffer';

export default async (filePath: string): Promise<Buffer> => {

  const { data, width, height } = await pixels(filePath);

  //@TODO: enforce pow2
  //@TODO: flip image so it's not upside down

  const pitch = Math.floor(((width * height) * 4 + 7) / 8);

  let offset = 0;

  const headerBuffer = Buffer.alloc(128);

  headerBuffer.write('DDS ', offset++ * 4, 'ascii');   // [0] magic
  headerBuffer.writeUInt32LE(124, offset++ * 4);       // [1] header size
  headerBuffer.writeUInt32LE(528391, offset++ * 4);    // [2] flags
  headerBuffer.writeUInt32LE(height, offset++ * 4);    // [3] height
  headerBuffer.writeUInt32LE(width, offset++ * 4);     // [4] width
  headerBuffer.writeUInt32LE(pitch, offset++ * 4);     // [5] pitch
  headerBuffer.writeUInt32LE(0, offset++ * 4);         // [6] depth
  headerBuffer.writeUInt32LE(1, offset++ * 4);         // [7] mipMapCount
  for (let i = 0; i < 11; i++) {
    headerBuffer.writeUInt32LE(0, offset++ * 4);         // [8 - 18] reserved
  }
  headerBuffer.writeUInt32LE(32, offset++ * 4);        // [19] pf size
  headerBuffer.writeUInt32LE(5, offset++ * 4);         // [20] pf flags
  headerBuffer.write('DXT1', offset++ * 4, 'ascii');   // [21] pf fourcc
  headerBuffer.writeUInt32LE(32, offset++ * 4);        // [22] pf rgbbitcount
  headerBuffer.writeUInt32LE(0xFF000000, offset++ * 4);// [23] pf rbitmask
  headerBuffer.writeUInt32LE(0xFF0000, offset++ * 4);  // [24] pf gbitmask
  headerBuffer.writeUInt32LE(0xFF00, offset++ * 4);    // [25] pf bbitmask
  headerBuffer.writeUInt32LE(0xFF, offset++ * 4);      // [26] pf abitmask
  headerBuffer.writeUInt32LE(0x1000, offset++ * 4);    // [27] caps

  const flags = dxt.flags.DXT1 | dxt.flags.ColourIterativeClusterFit | dxt.flags.ColourMetricPerceptual;

  const compressed = dxt.compress(
    data,
    width,
    height,
    flags
  );

  return Buffer.concat([
    headerBuffer,
    Buffer.from(compressed)
  ]);
}