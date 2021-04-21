import zlib from "zlib";
import dxt from 'dxt-js';
import pixels from 'image-pixels';

export default async (url: string): Promise<Buffer> => {
  
  const { data, width, height } = await pixels(url);

  const headerBuffer = Buffer.from([
    /*0000*/0x52, 0x53, 0x43, 0x37, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x04, 0x00, 0x02, 0xD0
  ]);

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
            ...Array(0x0100).fill(0x00),
    /*0300*/0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ...Array(0x1CF0).fill(0x00)
  ]);

  const filename = "texture";
  const hashKey = GetHashKey(filename);

  contentBuffer.writeInt32LE(hashKey,     0x0080);
  contentBuffer.writeUInt16LE(width,      0x01D0);
  contentBuffer.writeUInt16LE(height,     0x01D2);
  contentBuffer.writeUInt16LE(width / 2,  0x01D6);
  contentBuffer.write(filename,           0x0280);

  const flags = dxt.flags.DXT1 | dxt.flags.ColourIterativeClusterFit | dxt.flags.ColourMetricPerceptual;

  const imageBuffer = dxt.compress(
    data,
    width,
    height,
    flags
  );

  return new Promise((res, rej) => {
    
    zlib.deflateRaw(Buffer.concat([
      contentBuffer,
      imageBuffer
    ]), (err, resultBuffer) => {
      if (err) {
        return rej(err);
      }
      const finalBuffer = Buffer.concat([
        headerBuffer,
        resultBuffer
      ])
      res(finalBuffer);
    });
  });

}