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
  

  const rootPath = GetResourcePath(GetCurrentResourceName());

  //ResourceFile_GTA5_pc:138
  const ytd = Buffer.alloc(16, 0, 'binary');

  ytd.writeUInt32LE(RESOURCE_IDENT, 0);
  ytd.writeUInt32LE(VERSION,        4);
  ytd.writeUInt32LE(SYSTEM_FLAGS,   8);
  ytd.writeUInt32LE(GRAPHICS_FLAGS, 12);

  
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
  

  const header = Buffer.alloc(16, 0, 'binary');
  //ResourceFile:0x37435352,
  header.writeUInt32LE(0x37435352, 0);
  //ResourceFile:Version,
  header.writeInt32LE(13, 4);
  //ResourceFile:SystemFlags,
  header.writeUInt32LE(131072, 8);
  //ResourceFile:GraphicsFlags,
  header.writeUInt32LE(3489792006, 12);

  const output = Buffer.alloc(10000, 0, 'binary');

  let offset = 0;
  //TextureDictionary:VFT:Base
  output.writeUInt32LE(1079447504, offset);
  offset += 4;
  //TextureDictionary:Unknown_4h:Base
  output.writeUInt32LE(1, offset);
  offset += 4;
  //TextureDictionary:PagesInfoPointer:Base
  //output.writeLong(1342178048);
    output.writeUInt32LE(0, offset);
    offset += 4;
    output.writeUInt32LE(0, offset);
    offset += 4;
  //TextureDictionary:Unknown_10h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDictionary:Unknown_14h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDictionary:Unknown_18h
  output.writeUInt32LE(1, offset);
  offset += 4;
  //TextureDictionary:Unknown_1Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDictionary:TextureNameHashes:EntriesPointer
  //output.writeLong(1342177408);
  output.writeUInt32LE(0, offset);
  offset += 4;
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDictionary:TextureNameHashes:EntriesCount
  output.writeUInt16LE(1, offset);
  offset += 2;
  //TextureDictionary:TextureNameHashes:EntriesCapacity
  output.writeUInt16LE(1, offset);
  offset += 2;
  //TextureDictionary:TextureNameHashes:0
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDictionary:Textures:EntriesPointer
  //output.writeLong(1342177536);
    output.writeUInt32LE(0, offset);
    offset += 4;
    output.writeUInt32LE(0, offset);
    offset += 4;
  //TextureDictionary:Textures:EntriesCount
  output.writeUInt16LE(1, offset);
  offset += 2;
  //TextureDictionary:Textures:EntriesCapacity
  output.writeUInt16LE(1, offset);
  offset += 2;
  //TextureDictionary:Textures:0
  output.writeUInt32LE(0, offset);
  offset += 4;
  //Array uint
  output.writeUInt32LE(232298502, offset);
  offset += 4;
  //data_pointers:0
  //output.writeLong(1342177664);
    output.writeUInt32LE(0, offset);
    offset += 4;
    output.writeUInt32LE(0, offset);
    offset += 4;
  //TextureDX11:Base:VFT
  output.writeUInt32LE(1080137272, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_4h
  output.writeUInt32LE(1, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_4h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_10h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_14h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_18h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_1Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_20h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_24h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:NamePointer
  output.writeUInt32LE(1342177920, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_30h
  output.writeUInt32LE(8388609, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_34h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_38h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Base:Unknown_3Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_40h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_44h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_48h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_4Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Width
  output.writeUInt16LE(1024, offset);
  offset += 2;
  //TextureDX11:Height
  output.writeUInt16LE(1024, offset);
  offset += 4;
  //TextureDX11:Unknown_54h
  output.writeUInt16LE(1, offset);
  offset += 2;
  //TextureDX11:Stride
  output.writeUInt16LE(512, offset);
  offset += 2;
  //TextureDX11:Format
  output.writeUInt32LE(827611204, offset);
  offset += 4;
  //TextureDX11:Unknown_5Ch
  output.writeUInt8(0, offset);
  offset += 1;
  //TextureDX11:Levels
  output.writeUInt8(1, offset);
  offset += 1;
  //TextureDX11:Unknown_5Eh
  output.writeUInt16LE(0, offset);
  offset += 2;
  //TextureDX11:Unknown_60h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_64h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_68h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_6Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:DataPointer
  //output.writeLong(1610612736);
    output.writeUInt32LE(0, offset);
    offset += 4;
    output.writeUInt32LE(0, offset);
    offset += 4;
  //TextureDX11:Unknown_78h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_7Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_80h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_84h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_88h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TextureDX11:Unknown_8Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //string_r
  output.write("converted-from-jpg", offset),
  offset += 18;
  //PagesInfo:Unknown_0h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //PagesInfo:Unknown_4h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //PagesInfo:SystemPagesCount
  output.writeUInt8(1, offset);
  offset += 1;
  //PagesInfo:GraphicsPagesCount
  output.writeUInt8(1, offset);
  offset += 1;
  //PagesInfo:Unknown_Ah
  output.writeUInt16LE(0, offset);
  offset += 2;
  //PagesInfo:Unknown_Ch
  output.writeUInt32LE(0, offset);
  offset += 4;
  //PagesInfo:Unknown_10h
  output.writeUInt32LE(0, offset);
  offset += 4;
  //TexturesDX11:FullData
  output.write("", offset);

  const sample = fs.readFileSync(path.join(rootPath, "/samples/created-with-texturetoolkit2.ytd"), "binary")

  zlib.gzip(output, (err, result) => {
    const final = Buffer.concat([
      header,
      result
    ])
    for (let i = 0; i < 100; i++) {
      console.log(`${Math.floor(i / 4)}: ${final[i]} ${sample[i]}`);
    }
  });

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