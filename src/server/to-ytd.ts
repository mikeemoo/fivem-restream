import fs from "fs";
import path from "path";
import zlib from "zlib";

const RESOURCE_IDENT = 0x37435352;
const VERSION = 13;
const SYSTEM_FLAGS = 131072;
const GRAPHICS_FLAGS = 3489792006;

export default async (width: number, height: number, stride: number, ddsBuffer: Buffer) => {
  
  try {

    const rootPath = GetResourcePath && GetCurrentResourceName ? GetResourcePath(GetCurrentResourceName()) : __dirname;

    const headerBuffer = Buffer.alloc(16, 0, "binary");
    headerBuffer.writeUInt32LE(0x37435352, 0x0000);
    headerBuffer.writeInt32LE(13,          0x0004);
    headerBuffer.writeUInt32LE(131072,     0x0008);
    headerBuffer.writeUInt32LE(3489792006, 0x000C);

    const contentBuffer = Buffer.from([
      /*0010*/0xD0, 0x0F, 0x57, 0x40, 0x01, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00,
      /*0020*/0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      /*0030*/0x80, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
      /*0040*/0x00, 0x01, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
              ...Array(192).fill(0x00),
      /*0110*/0x80, 0x01, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              ...Array(112).fill(0x00),
      /*0190*/0x38, 0x96, 0x61, 0x40, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              ...Array(16).fill(0x00),
      /*01B0*/0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x02, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00,
      /*01C0*/0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      /*01D0*/0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      /*01E0*/0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x44, 0x58, 0x54, 0x31, 0x00, 0x01, 0x00, 0x00,
              ...Array(16).fill(0x00),
      /*0200*/0x00, 0x00, 0x00, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              ...Array(0x1df0).fill(0x00)
    ]);

    const filename = "texture";
    const hashKey = GetHashKey(filename);
    contentBuffer.writeInt32LE(hashKey,   0x0080);
    contentBuffer.writeUInt16LE(width,    0x01D0);
    contentBuffer.writeUInt16LE(height,   0x01D2);
    contentBuffer.writeUInt16LE(stride,   0x01D6);
    contentBuffer.write(filename,         0x0280);

    const fullBuffer = Buffer.concat([
      headerBuffer,
      contentBuffer,
      ddsBuffer
    ]);
    
    fs.writeFileSync(path.join(rootPath, "/samples/reconstruction.ytd"), fullBuffer);

  }catch (e) {
    console.log(e.message, e.stack);
  }

  // zlib.gzip(output, (err, result) => {
  //   const final = Buffer.concat([
  //     header,
  //     result
  //   ])
  //   for (let i = 0; i < 100; i++) {
  //     console.log(`${Math.floor(i / 4)}: ${final[i]} ${sample[i]}`);
  //   }
  // });
  
  return ddsBuffer;
}