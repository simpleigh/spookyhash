# `spookyhash`

Node bindings for SpookyHash V2.

SpookyHash was devised by Bob Jenkins and is described as
"a 128-bit noncryptographic hash".
This package provides Node.js bindings for that library.

## Usage

```javascript
const spookyhash = require('spookyhash');

spookyhash.hash128(Buffer.from('Test Message'))
// <Buffer 01 e7 5a b5 6a 0a 16 13 2b 9d 9b f4 d0 b3 5d f6>

spookyhash.hash128(Buffer.from('Test message'), 3141592653589793238n, 2718281828459045235n);
// <Buffer ab 95 34 ca 56 03 a6 41 c3 69 ae 6e c1 b8 98 1d>
```

`hash128(message: Buffer, seed1?: BigInt, seed2?: BigInt): Buffer`

* `message` - message to hash
* `seed1`, `seed2` - seeds for the hash calculation.
  These must be valid unsigned 64-bit integers.
  If not provided these default to `0`.

## Development

To install locally:

```shell
yarn install
yarn jest
```

To rebuild the Node.JS addon:

```shell
yarn node-gyp rebuild
```

## Similar projects

[`node-spookyhash-v2`](https://github.com/nathankellenicki/node-spookyhash-v2)
also provides NodeJS bindings for SpookyHash V2.
Unfortunately it's not been updated for some years and doesn't work with newer
versions of Node.
From 2021-04-30 it will not run on any supported version of Node.

I spent a little time attempting to upgrade that code, but decided it would be
easier to build new bindings using N-API rather than learn the v8 API!

## References for contributors

* [Node.js - C++ addons](https://nodejs.org/docs/latest-v14.x/api/addons.html)
* [Node.js - N-API](https://nodejs.org/docs/latest-v14.x/api/n-api.html)
* [`node-addon-api`](https://github.com/nodejs/node-addon-api)
* [Jest](https://jestjs.io/docs/en/getting-started.html)
* [`node-spookyhash-v2`](https://github.com/nathankellenicki/node-spookyhash-v2)
