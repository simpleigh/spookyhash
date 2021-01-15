const spookyhash = require('..');

const message = "Test message";

console.log(spookyhash.hash128(Buffer.from(message)).toString('hex'));
