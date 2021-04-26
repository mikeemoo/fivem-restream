# FiveM Restream

This resource exposes a single method for loading a texture from a remote URL.

## Usage

To use this resource, first make an empty resource called `texture-loader` with nothing but a `stream` folder and an `fxmanifest.lua` file.

```javascript
exports['fivem-restream'].loadRemoteTexture(
  `http://.../myimage.png`,
  (err, definition) => {

    if (err) {
      console.log("There was a problem loading texture");
      return;
    }

    const { dictionary, texture } = definition;

    AddReplaceTexture("origTxd", "origTx", dictionary, texture);
  }
);
```