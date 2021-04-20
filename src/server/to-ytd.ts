import fs from "fs";
import path from "path";
import zlib from "zlib";

const RESOURCE_IDENT = 0x37435352;
const VERSION = 13;
const SYSTEM_FLAGS = 131072;
const GRAPHICS_FLAGS = 3489792006;

type Block = {
  Length: number;
  Position: number;
}

const BASE_SIZE = 0x2000;

const assignPositions = (blocks: Block[]) => {
  const largestBlockSize = [...blocks].sort((a, b) => b.Length - a.Length)[0].Length;
  let currentPageSize = BASE_SIZE;
  while (currentPageSize < largestBlockSize) {
    currentPageSize *= 2;
  }
  let currentPageCount = 0;
  let currentPosition = 0;
  let loops = 0;
  while (loops++ < 10000) {
    for (const block of blocks) {
      const maxSpace = currentPageCount * currentPageSize - currentPosition;
      if (maxSpace < (block.Length + 64)) {
          currentPageCount++;
          currentPosition = currentPageSize * (currentPageCount - 1);
      }
      block.Position = currentPosition;
      currentPosition += block.Length + 64;
      if ((currentPosition % 64) != 0) {
        currentPosition += (64 - (currentPosition % 64));
      }
    }
    // break if everything fits...
    if (currentPageCount < 128) {
      break;
    }

    currentPageSize *= 2;
  }
  
  return {
    pageSize: currentPageSize,
    pageCount: currentPageCount
  }
}

export default async (ddsBuffer: Buffer) => {
  

  const rootPath = GetResourcePath && GetCurrentResourceName ? GetResourcePath(GetCurrentResourceName()) : __dirname;

  
  //ResourceFile_GTA5_pc:215 getBlocks
  const graphicBlocks = [
    //TextureData_GTA5_pc
    {
      FullData: [],
      Length: 524288,
      Position: 0
    }
  ]
  const systemBlocks = [
    //TextureDictionary
    { 
      Length: 64,
      Position: 0,
      Unknown_18h: 1,
      Unknown_4h: 1,
      VFT: 1079447504,
      PagesInfo: {
        // see below
      }
    },
    //ResourceSimpleArray<uint_r>
    {
      Length: 4,
      Position: 0,
      Data: [{
        Length: 4,
        Value: 232298502
      }]
    },
    //ResourcePointerArray64<TextureDX11>
    { 
      Length: 8,
      Position: 0,
      data_items: [
        {
          // see below
        }
      ],
      data_pointers: null
    },
    //TextureDX11
    {
      VFT: 1080137272,
      Format: 827611204,
      Height: 1024,
      Width: 1024,
      Length: 144,
      Position: 0,
      Levels: 1,
      Name: {
        // see below
      },
      Stride: 512,
      Unknown_4h: 1,
      Unknown_30h: 8388609,
      Unknown_54h: 1
    },
    //string_r
    {
      Length: 19,
      Value: "converted-from-jpg",
      Position: 0
    },
    //PagesInfo_GTA5_pc
    { 
      Length: 20,
      Position: 0
    },
  ];

  //ResourceFile_GTA5_pc:219
  const { pageSize: systemPageSize, pageCount: systemPageCount } = assignPositions(systemBlocks);
  //ResourceFile_GTA5_pc:223
  const { pageSize: graphicPageSize, pageCount: graphicPageCount } = assignPositions(graphicBlocks);
  
  const sample = Buffer.from(fs.readFileSync(path.join(rootPath, "/samples/without-compression.ytd")));

  const debug = (buffer: any, label: string, offset: number, length: number) => {
    console.log(`${label} (mine):   ${[...Array(length)].map((_, i) => buffer[offset + i].toString(16)).join(", ")}`);
    console.log(`${label} (theirs): ${[...Array(length)].map((_, i) => sample[offset + 16 + i].toString(16)).join(", ")}`);
  }

  const createWriter = (buffer) => {
    let offset = 0;
    return {
      write: (data: any, label: string) => {
        
        buffer.write(data, offset);
        debug(buffer, label, offset, data.length);
        offset += data.length;
      },
      writeUInt8: (data: number, label: string) => {
        buffer.writeUInt8(data, offset);
        debug(buffer, label, offset, 1);
        offset++;
      },
      writeUInt16LE: (data: number, label: string) => {
        buffer.writeUInt16LE(data, offset);
        debug(buffer, label, offset, 2);
        offset += 2;
      },
      writeUInt32LE: (data: number, label: string) => {
        buffer.writeUInt32LE(data, offset);
        debug(buffer, label, offset, 4);
        offset += 4;
      },
      writeUInt64LE: (data: number, label: string) => {
        buffer.writeUInt32LE(0, offset);
        offset += 4;
        buffer.writeUInt32LE(0, offset);
        offset += 4;
        debug(buffer, label, offset, 8);
      }
    }

  }

  const header = Buffer.alloc(16, 0, 'binary');
  header.writeUInt32LE(0x37435352, 0);
  header.writeInt32LE(13, 4);
  header.writeUInt32LE(131072, 8);
  header.writeUInt32LE(3489792006, 12);

  const output = Buffer.alloc(10000, 0, 'binary');

  const writer = createWriter(output);

  writer.writeUInt32LE(1079447504, "TextureDictionary:VFT:Base");
  writer.writeUInt32LE(1, "TextureDictionary:Unknown_4h:Base");
  writer.writeUInt64LE(1342178048, "TextureDictionary:PagesInfoPointer:Base");
  writer.writeUInt32LE(0, "TextureDictionary:Unknown_10h");
  writer.writeUInt32LE(0, "TextureDictionary:Unknown_14h");
  writer.writeUInt32LE(1, "TextureDictionary:Unknown_18h");
  writer.writeUInt32LE(0, "TextureDictionary:Unknown_1Ch");
  writer.writeUInt64LE(0, "TextureDictionary:PagesInfoPointer:Base");
  writer.writeUInt16LE(1, "TextureDictionary:TextureNameHashes:EntriesCount");
  writer.writeUInt16LE(1, "TextureDictionary:TextureNameHashes:EntriesCapacity");
  writer.writeUInt32LE(0, "TextureDictionary:TextureNameHashes:0");
  writer.writeUInt64LE(0, "TextureDictionary:Textures:EntriesPointer");
  writer.writeUInt16LE(1, "TextureDictionary:Textures:EntriesCount");
  writer.writeUInt16LE(1, "TextureDictionary:Textures:EntriesCapacity");
  writer.writeUInt32LE(0, "TextureDictionary:Textures:0");
  // already going wrong around here somewhere. Presumably because we're not aligning to blocks yet
  writer.writeUInt32LE(232298502, "Array uint"); // [6, 98, d8, d]
  writer.writeUInt64LE(0, "data_pointers:0");
  writer.writeUInt32LE(1080137272, "TextureDX11:Base:VFT");
  writer.writeUInt32LE(1, "TextureDX11:Base:Unknown_4h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_8h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_Ch");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_10h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_14h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_18h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_1Ch");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_20h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_24h");
  writer.writeUInt64LE(0, "TextureDX11:Base:NamePointer");
  writer.writeUInt32LE(8388609, "TextureDX11:Base:Unknown_30h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_38h");
  writer.writeUInt32LE(0, "TextureDX11:Base:Unknown_3Ch");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_40h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_44h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_48h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_4Ch");
  writer.writeUInt16LE(1024, "TextureDX11:Width");
  writer.writeUInt16LE(1024, "TextureDX11:Height");
  writer.writeUInt16LE(1024, "TextureDX11:Unknown_54h");
  writer.writeUInt16LE(512, "TextureDX11:Stride");
  writer.writeUInt32LE(827611204, "TextureDX11:Format");
  writer.writeUInt8(0, "TextureDX11:Unknown_5Ch");
  writer.writeUInt8(0, "TextureDX11:Levels");
  writer.writeUInt16LE(0, "TextureDX11:Unknown_5Eh");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_60h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_64h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_68h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_6Ch");
  writer.writeUInt64LE(0, "TextureDX11:DataPointer");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_78h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_7Ch");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_80h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_84h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_88h");
  writer.writeUInt32LE(0, "TextureDX11:Unknown_8Ch");

  //string_r
  writer.write("converted-from-jpg", "string_r"),
  //PagesInfo:Unknown_0h
  writer.writeUInt32LE(0, "PagesInfo:Unknown_0h");
  writer.writeUInt32LE(0, "PagesInfo:Unknown_4h");
  writer.writeUInt8(1, "PagesInfo:SystemPagesCount");
  writer.writeUInt8(1, "PagesInfo:GraphicsPagesCount");
  writer.writeUInt16LE(0, "PagesInfo:Unknown_Ah");
  writer.writeUInt32LE(0, "PagesInfo:Unknown_Ch");
  writer.writeUInt32LE(0, "PagesInfo:Unknown_10h");
  //TexturesDX11:FullData
  output.write("");

  const final = Buffer.concat([
    header,
    output
  ])
  // zlib.gzip(output, (err, result) => {
  //   const final = Buffer.concat([
  //     header,
  //     result
  //   ])
  //   for (let i = 0; i < 100; i++) {
  //     console.log(`${Math.floor(i / 4)}: ${final[i]} ${sample[i]}`);
  //   }
  // });

  //SystemDataLength = 8192
  //GraphicsDataLength = 524288 
  
  
  return ddsBuffer;
  // //ResourceFile_GTA5_pc:228
  // const fileBase = {
  //   PagesInfo: {
  //     SystemPagesCount: systemPageCount,
  //     GraphicsPagesCount: graphicPageCount
  //   }
  // }

  // // Some complicated shit going on here with the resource writer and stream positions. I haven't reflect that in this yet.

  // const resourceWriter = {
  //   Position: 0
  // };

  // //ResourceFile_GTA5_pc:244-237
  // for (let block of [...systemBlocks, ...graphicBlocks]) {
  //   resourceWriter.Position = block.Position;
  //   let blockBefore = block.Position;
  //   //block.write(resourceWriter);
  //   if ((block.Position - blockBefore) != block.Length) {
  //       throw new Error("error in system length");
  //   }
  // }

  // return ddsBuffer;
}