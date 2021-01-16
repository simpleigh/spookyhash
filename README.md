# spookyhash

[![npm](https://img.shields.io/npm/v/spookyhash.svg)](https://www.npmjs.com/package/spookyhash)
[![Build](https://github.com/simpleigh/spookyhash/workflows/Build/badge.svg)](https://github.com/simpleigh/spookyhash/actions?query=branch%3Amaster)
[![Downloads](https://img.shields.io/npm/dt/spookyhash.svg)](https://www.npmjs.com/package/spookyhash)
![Node](https://img.shields.io/node/v-lts/spookyhash)
[![Issues](https://img.shields.io/github/issues/simpleigh/spookyhash.svg)](https://github.com/simpleigh/spookyhash/issues)
[![Licence](https://img.shields.io/npm/l/spookyhash)](https://github.com/simpleigh/spookyhash/blob/master/LICENCE.txt)

Node bindings for SpookyHash V2.

## Table of Contents

* [`spookyhash`](#spookyhash-1)
  * [Similar projects](#similar-projects)
  * [Class: `Hash`](#class-hash)
    * [`new Hash([seed1[, seed2]])`](#new-hashseed1-seed2)
    * [`hash.digest()`](#hashdigest)
    * [`hash.update(message)`](#hashupdatemessage)
  * [`spookyhash` module methods and properties](#spookyhash-module-methods-and-properties)
    * [`spookyhash.hash128(message[, seed1[, seed2]])`](#spookyhashhash128message-seed1-seed2)
    * [`spookyhash.hash64(message[, seed])`](#spookyhashhash64message-seed)
    * [`spookyhash.hash32(message[, seed])`](#spookyhashhash32message-seed)

## `spookyhash`

The `spookyhash` module provides wrappers for [SpookyHash] V2.

SpookyHash was devised by Bob Jenkins and is described as
"a 128-bit noncryptographic hash".

[SpookyHash]: http://burtleburtle.net/bob/hash/spooky.html

Use `require('spookyhash')` to access this module.

```javascript
const spookyhash = require('spookyhash');

const secret = Buffer.from('abdcdefg');

const hash = new spookyhash.Hash();
hash.update(secret);
console.log(hash.digest().toString('hex'));
// Prints:
//   7ea54bc662fb34e1e1057e271a0d3782

console.log(spookyhash.hash128(secret).toString('hex'));
// Prints:
//   7ea54bc662fb34e1e1057e271a0d3782

console.log(spookyhash.hash64(secret));
// Prints:
//   16227871758974952830n

console.log(spookyhash.hash32(secret));
// Prints:
//   1938270189
```

### Similar projects

[`node-spookyhash-v2`](https://github.com/nathankellenicki/node-spookyhash-v2)
also provides NodeJS bindings for SpookyHash V2.
Unfortunately it's not been updated for some years and doesn't work with newer
versions of Node.
From 2021-04-30 it will not run on any supported version of Node.

I spent a little time attempting to upgrade that code, but decided it would be
easier to build new bindings using N-API rather than learn the v8 API!

## Class: `Hash`

The `Hash` class is a utility for assembling a 128-bit hash from separate parts
(unlike [`hash128`](#spookyhashhash128message-seed1-seed2)) which requires the
entire message to be available).

```javascript
const hash = new spookyhash.Hash();
hash.update(Buffer.from('one'));
console.log(hash.digest().toString('hex'));
// Prints:
//   d19880c1b51c5eab60a2da1901446f99

hash.update(Buffer.from('two'));
console.log(hash.digest().toString('hex'));
// Prints:
//   4042682e0a624f3d0d29a6f8a6c5db76

hash.update(Buffer.from('three'));
console.log(hash.digest().toString('hex'));
// Prints:
//   74782eb99a1d50c3ad109b7c9beaaeac
```

### `new Hash([seed1[, seed2]])`

* `seed1`, `seed2` [`<BigInt>`] Seeds for the hash calculation.
  These must be unsigned, 64-bit integers.
  If not provided then a default of `0n` will be used.

```javascript
const hash1 = new spookyhash.Hash();
hash1.update(Buffer.from('Test Message'))
console.log(hash1.digest())
// Prints:
//   <Buffer 01 e7 5a b5 6a 0a 16 13 2b 9d 9b f4 d0 b3 5d f6>

const hash2 = new spookyhash.Hash(3141592653589793238n, 2718281828459045235n);
hash2.update(Buffer.from('Test Message'))
console.log(hash2.digest())
// Prints:
//   <Buffer 52 26 cf 42 95 35 93 66 3d ac 4a f4 5a 83 fc eb>
```

### `hash.digest()`

* Returns: [`<Buffer>`]

Calculates the digest of all the data passed to be hashed
(using the [`hash.update()`](#hashupdatemessage) method).

### `hash.update(message)`

* `message` [`<Buffer>`] The message to hash

Updates the hash content with the given `message`.

This can be called many times with new data as it is streamed.

## `spookyhash` module methods and properties

### `spookyhash.hash128(message[, seed1[, seed2]])`

* `message` [`<Buffer>`] The message to hash

* `seed1`, `seed2` [`<BigInt>`] Seeds for the hash calculation.
  These must be unsigned, 64-bit integers.
  If not provided then a default of `0n` will be used.

* Returns: [`<Buffer>`]

Calculates a 128-bit hash of the provided [`Buffer`].

```javascript
spookyhash.hash128(Buffer.from('Test Message'))
// Prints:
//   <Buffer 01 e7 5a b5 6a 0a 16 13 2b 9d 9b f4 d0 b3 5d f6>

spookyhash.hash128(Buffer.from('Test message'), 3141592653589793238n, 2718281828459045235n);
// Prints:
//   <Buffer ab 95 34 ca 56 03 a6 41 c3 69 ae 6e c1 b8 98 1d>
```

### `spookyhash.hash64(message[, seed])`

* `message` [`<Buffer>`] The message to hash

* `seed` [`<BigInt>`] Seed for the hash calculation.
  This must be an unsigned, 64-bit integer.
  If not provided then a default of `0n` will be used.

* Returns: [`<BigInt>`].

Calculates a 64-bit hash of the provided [`Buffer`].

```javascript
spookyhash.hash64(Buffer.from('Test Message'));
// Prints:
//   9120740005544271225n

spookyhash.hash64(Buffer.from('Test message'), 3141592653589793238n);
// Prints:
//   9667288884877287795n
```

### `spookyhash.hash32(message[, seed])`

* `message` [`<Buffer>`] The message to hash

* `seed` [`<integer>`] Seed for the hash calculation.
  If not provided then a default of `0` will be used.

* Returns: [`<integer>`]

Calculates a 32-bit hash of the provided [`Buffer`].

```javascript
spookyhash.hash32(Buffer.from('Test Message'));
// Prints:
//   388570489

spookyhash.hash32(Buffer.from('Test Message'), 42);
// Prints:
//   4254323322
```

[`<BigInt>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#bigint_type
[`<Buffer>`]: https://nodejs.org/api/buffer.html#buffer_class_buffer
[`<integer>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type
[`Buffer`]: https://nodejs.org/api/buffer.html#buffer_class_buffer
