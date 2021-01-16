/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hash128 } = require('..');
const {
    NOT_BIGINT,
    NOT_BUFFER,
    NOT_INVALID_BIGINT,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('hash128 function', () => {

    it('exists', () => {
        expect(hash128).toBeDefined();
        expect(typeof hash128).toBe('function');
    });

    it('throws if not given a message', () => {
        expect(() => hash128()).toThrow();
    });

    it.each([
        ...NOT_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the message is %s', (name, value) => {
        expect(() => hash128(value)).toThrow();
    });

    it.each([
        ...NOT_BUFFER,
        ...NOT_INVALID_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the first seed is %s', (name, value) => {
        expect(() => hash128(Buffer.from('test'), value)).toThrow();
    });

    it.each([
        ...NOT_BUFFER,
        ...NOT_INVALID_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the second seed is %s', (name, value) => {
        expect(() => hash128(Buffer.from('test'), 0n, value)).toThrow();
    });

    it('throws if given too many parameters', () => {
        expect(() => hash128(Buffer.from('test'), 0n, 0n, 'extra')).toThrow();
    });

    it('returns a buffer of the correct length', () => {
        expect(hash128(Buffer.from('test'))).toHaveLength(16);
    });

    it('hashes an empty buffer to a consistent value', () => {
        const expected = Buffer.from([
            0x19, 0x09, 0xf5, 0x6b, 0xfc, 0x06, 0x27, 0x23,
            0xc7, 0x51, 0xe8, 0xb4, 0x65, 0xee, 0x72, 0x8b,
        ]);
        expect(hash128(Buffer.alloc(0))).toEqual(expected);
    });

    it('hashes a test buffer to a consistent value', () => {
        const expected = Buffer.from([
            0x75, 0x8b, 0x0d, 0xec, 0xbc, 0xe8, 0x01, 0x7b,
            0x60, 0xac, 0xff, 0xd5, 0xa8, 0x98, 0x6f, 0x0b,
        ]);
        expect(hash128(Buffer.from('test'))).toEqual(expected);
    });

    it('hashes different messages to different values', () => {
        expect(hash128(Buffer.from('test')))
            .not.toEqual(hash128(Buffer.from('different')));
    });

    it('hashes to a new value if given a first seed', () => {
        expect(hash128(Buffer.from('test'), 42n))
            .not.toEqual(hash128(Buffer.from('test')));
    });

    it('hashes to a new value if given a second seed', () => {
        expect(hash128(Buffer.from('test'), 42n, 43n))
            .not.toEqual(hash128(Buffer.from('test'), 42n));
    });

    it('uses 0 as a default value for both seeds', () => {
        expect(hash128(Buffer.from('test'), 0n, 0n))
            .toEqual(hash128(Buffer.from('test')));
    });

});
