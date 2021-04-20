// import fs from "fs";
// import path from "path";

// const RESOURCE_IDENT = 0x37435352;
// const VERSION = 13;
// const SYSTEM_FLAGS = 131072;
// const GRAPHICS_FLAGS = 3489792006;

// class Texture {
//   VFT = 0x40619638;
//   Unknown_4h = 0x00000001;
//   Unknown_8h = 0x00000000;
//   Unknown_Ch = 0x00000000;
//   Unknown_10h = 0x00000000;
//   Unknown_14h = 0x00000000;
//   Unknown_18h = 0x00000000;
//   Unknown_1Ch = 0x00000000;
//   Unknown_20h = 0x00000000;
//   Unknown_24h = 0x00000000;
//   Unknown_30h = 0x00800001; // ??
//   Unknown_34h = 0x00000000;
//   Unknown_38h = 0x00000000;
//   Unknown_3Ch = 0x00000000;
//   Unknown_40h = 0x00000000; // ??
//   Unknown_44h = 0x00000000;
//   Unknown_48h = 0x00000000;
//   Unknown_4Ch = 0x00000000;
//   Unknown_54h = 0x0001;
//   Unknown_5Ch = 0x00;
//   Unknown_5Eh = 0x0000;
//   Unknown_60h = 0x00000000;
//   Unknown_64h = 0x00000000;
//   Unknown_68h = 0x00000000;
//   Unknown_6Ch = 0x00000000;
//   Unknown_78h = 0x00000000;
//   Unknown_7Ch = 0x00000000;
//   Unknown_80h = 0x00000000;
//   Unknown_84h = 0x00000000;
//   Unknown_88h = 0x00000000;
//   Unknown_8Ch = 0x00000000;
//   constructor () {

//   }
//   setData (data) {
//     this.data = data;
//   }

//   write () {
//     // from base
//     this.NamePointer = (ulong)(this.Name?.Position ?? 0);

//     // write structure data
//     writer.Write(this.VFT);
//     writer.Write(this.Unknown_4h);
//     writer.Write(this.Unknown_8h);
//     writer.Write(this.Unknown_Ch);
//     writer.Write(this.Unknown_10h);
//     writer.Write(this.Unknown_14h);
//     writer.Write(this.Unknown_18h);
//     writer.Write(this.Unknown_1Ch);
//     writer.Write(this.Unknown_20h);
//     writer.Write(this.Unknown_24h);
//     writer.Write(this.NamePointer);
//     writer.Write(this.Unknown_30h);
//     writer.Write(this.Unknown_34h);
//     writer.Write(this.Unknown_38h);
//     writer.Write(this.Unknown_3Ch);

//     // 
//     this.DataPointer = (ulong)this.Data.Position;

//     // write structure data
//     writer.Write(this.Unknown_40h);
//     writer.Write(this.Unknown_44h);
//     writer.Write(this.Unknown_48h);
//     writer.Write(this.Unknown_4Ch);
//     writer.Write(this.Width);
//     writer.Write(this.Height);
//     writer.Write(this.Unknown_54h);
//     writer.Write(this.Stride);
//     writer.Write(this.Format);
//     writer.Write(this.Unknown_5Ch);
//     writer.Write(this.Levels);
//     writer.Write(this.Unknown_5Eh);
//     writer.Write(this.Unknown_60h);
//     writer.Write(this.Unknown_64h);
//     writer.Write(this.Unknown_68h);
//     writer.Write(this.Unknown_6Ch);
//     writer.Write(this.DataPointer);
//     writer.Write(this.Unknown_78h);
//     writer.Write(this.Unknown_7Ch);
//     writer.Write(this.Unknown_80h);
//     writer.Write(this.Unknown_84h);
//     writer.Write(this.Unknown_88h);
//     writer.Write(this.Unknown_8Ch);
//   }
// }

// class TextureDictionary {
//   VFT; ?
//   Unknown_4h; ?
//   PagesInfoPointer; ?
//   Unknown_10h = 0x00000000
//   Unknown_14h = 0x00000000
//   Unknown_18h = 0x00000001
//   Unknown_1Ch = 0x00000000
//   constructor () {
//     this.TextureNameHashes = new ResourceSimpleList64<uint_r>();
//     this.Textures = new ResourcePointerList64<TextureDX11>();
//   }

//   write () {
//     // from base
//     writer.Write(this.VFT);
//     writer.Write(this.Unknown_4h);
//     writer.Write(this.PagesInfoPointer);
//     // write structure data
//     writer.Write(this.Unknown_10h);
//     writer.Write(this.Unknown_14h);
//     writer.Write(this.Unknown_18h);
//     writer.Write(this.Unknown_1Ch);
//     writer.WriteBlock(this.TextureNameHashes);
//     writer.WriteBlock(this.Textures);
//   }

// }
// class TextureDictionaryFileWrapper_GTA5_pc {
//   VFT = 0x40570fd0;
//   Unknown_4h = 0x00000001;
//   Unknown_10h = 0x00000000;
//   Unknown_14h = 0x00000000;
//   Unknown_18h = 0x00000001;
//   Unknown_1Ch = 0x00000000;
//   constructor() {
//     textureDictionary = new TextureDictionary();
//     textureDictionary.TextureNameHashes.Entries = new ResourceSimpleArray<uint_r>();
//     textureDictionary.Textures.Entries = new ResourcePointerArray64<TextureDX11>();
//     textureDictionary.Textures.Add(texture);
//   }
// }

// export default async (ddsBuffer: Buffer) => {
  
//   const ytd = Buffer.alloc(10000, 0, 'binary');

//   const rootPath = GetResourcePath(GetCurrentResourceName());
//   const sample = fs.readFileSync(path.join(rootPath, `samples/created-with-texturetoolkit.ytd`));

//   const textureDictionaryFile = new TextureDictionaryFileWrapper_GTA5_pc();
//   textureDictionaryFile.Save(fileName);

//   let offset = 0;
//   ytd.writeUInt32LE(RESOURCE_IDENT, offset++ * 4);
//   ytd.writeUInt32LE(VERSION, offset++ * 4);
//   ytd.writeUInt32LE(SYSTEM_FLAGS, offset++ * 4);
//   ytd.writeUInt32LE(GRAPHICS_FLAGS, offset++ * 4);

//   for (let i = 0; i < 32; i++) {
//     console.log(`${Math.floor(i / 4)}: ${sample[i]} ${ytd[i]}`);
//   }

//   return ddsBuffer;
// }