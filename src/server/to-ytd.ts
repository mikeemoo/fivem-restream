import fs from "fs";
import path from "path";

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
  let offset = 0;

  ytd.writeUInt32LE(RESOURCE_IDENT, offset++ * 4);
  ytd.writeUInt32LE(VERSION, offset++ * 4);
  ytd.writeUInt32LE(SYSTEM_FLAGS, offset++ * 4);
  ytd.writeUInt32LE(GRAPHICS_FLAGS, offset++ * 4);

  
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
  
  console.log(systemBlocks);
  
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