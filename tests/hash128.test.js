/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hash128 } = require('..');
const {
    NOT_BIGINT,
    NOT_INVALID_BIGINT,
    NOT_INVALID_BUFFER,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('hash128 function', () => {

    const message = Buffer.from('test');

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
        ...NOT_INVALID_BIGINT,
        ...NOT_INVALID_BUFFER,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the first seed is %s', (name, value) => {
        expect(() => hash128(message, value)).toThrow();
    });

    it.each([
        ...NOT_INVALID_BIGINT,
        ...NOT_INVALID_BUFFER,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the second seed is %s', (name, value) => {
        expect(() => hash128(message, Buffer.alloc(8), value)).toThrow();
    });

    it('throws if given too many parameters', () => {
        expect(
            () => hash128(message, Buffer.alloc(8), Buffer.alloc(8), 'extra'),
        ).toThrow();
    });

    it('returns a buffer of the correct length', () => {
        expect(hash128(message)).toHaveLength(16);
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
        expect(hash128(message)).toEqual(expected);
    });

    it('hashes different messages to different values', () => {
        expect(hash128(message)).not.toEqual(hash128(Buffer.from('different')));
    });

    describe('Buffer seed', () => {
        it('hashes to a new value if given a first seed', () => {
            const seed1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
            expect(hash128(message, seed1)).not.toEqual(hash128(message));
        });

        it('hashes to a new value if given a second seed', () => {
            const seed1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const seed2 = Buffer.from([9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0]);
            expect(hash128(message, seed1, seed2))
                .not.toEqual(hash128(message, seed1));
        });

        it('uses 0 as a default value for both seeds', () => {
            expect(hash128(message, Buffer.alloc(8), Buffer.alloc(8)))
                .toEqual(hash128(message));
        });
    });

    describe('BigInt seed', () => {
        it('hashes to a new value if given a first seed', () => {
            expect(hash128(message, 42n)).not.toEqual(hash128(message));
        });

        it('hashes to a new value if given a second seed', () => {
            expect(hash128(message, 42n, 43n)).not.toEqual(hash128(message, 42n));
        });

        it('uses 0 as a default value for both seeds', () => {
            expect(hash128(message, 0n, 0n)).toEqual(hash128(message));
        });

    });

    it('hashes to the same value regardless of seed type', () => {
        const withBuffer = hash128(
            message,
            Buffer.from([0x75, 0x8b, 0x0d, 0xec, 0xbc, 0xe8, 0x01, 0x7b]),
            Buffer.from([0x60, 0xac, 0xff, 0xd5, 0xa8, 0x98, 0x6f, 0x0b]),
        );
        const withBigInt = hash128(
            message,
            8863621439753653109n,
            824045107744320608n,
        );
        expect(withBuffer).toStrictEqual(withBigInt);
    });

});
