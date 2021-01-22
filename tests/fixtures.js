/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const NOT_BIGINT = [
    ['BigInt', 42n],
];

const NOT_BUFFER = [
    ['Buffer', Buffer.from('buffer')],
];

const NOT_INVALID_BIGINT = [
    ['negative BigInt', -3n],
    ['fractional BigInt', 0.5],
    ['too large BigInt', BigInt('18446744073709551616')],  // 2^64
];

const NOT_INVALID_BUFFER = [
    ['empty Buffer', Buffer.alloc(0)],
    ['too short Buffer', Buffer.alloc(7)],
    ['too long Buffer', Buffer.alloc(9)],
];

const NOT_NUMBER = [
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['Number', 42],
];

const NOT_OTHER = [
    ['Boolean', true],
    ['Function', () => null],
    ['null', null],
    ['Object', { }],
    ['RegExp', /match/],
    ['String', 'string'],
    ['Symbol', Symbol()],
    ['undefined', undefined],
];

module.exports = {
    NOT_BIGINT,
    NOT_BUFFER,
    NOT_INVALID_BIGINT,
    NOT_INVALID_BUFFER,
    NOT_NUMBER,
    NOT_OTHER,
};
