/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hash64 } = require('..');
const {
    NOT_BIGINT,
    NOT_INVALID_BIGINT,
    NOT_INVALID_BUFFER,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('hash64 function', () => {

    const message = Buffer.from('test');

    it('exists', () => {
        expect(hash64).toBeDefined();
        expect(typeof hash64).toBe('function');
    });

    it('throws if not given a message', () => {
        expect(() => hash64()).toThrow();
    });

    it.each([
        ...NOT_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the message is %s', (name, value) => {
        expect(() => hash64(value)).toThrow();
    });

    it.each([
        ...NOT_INVALID_BIGINT,
        ...NOT_INVALID_BUFFER,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the seed is %s', (name, value) => {
        expect(() => hash64(message, value)).toThrow();
    });

    it('throws if given too many parameters', () => {
        expect(() => hash64(message, Buffer.alloc(8), 'extra')).toThrow();
    });

    it('returns a BigInt', () => {
        expect(typeof hash64(message)).toBe('bigint');
    });

    it('hashes to a consistent value', () => {
        expect(hash64(message)).toEqual(8863621439753653109n);
    });

    it('hashes different messages to different values', () => {
        expect(hash64(message)).not.toEqual(hash64(Buffer.from('different')));
    });

    describe('Buffer seed', () => {
        it('hashes to a new value if given a seed', () => {
            expect(hash64(message, Buffer.from([1, 2, 3, 4, 5, 6, 7, 8])))
                .not.toEqual(hash64(message));
        });

        it('uses 0 as a default value for the seed', () => {
            expect(hash64(message, Buffer.alloc(8))).toEqual(hash64(message));
        });
    });

    describe('BigInt seed', () => {
        it('hashes to a new value if given a seed', () => {
            expect(hash64(message, 42n)).not.toEqual(hash64(message));
        });

        it('uses 0 as a default value for the seed', () => {
            expect(hash64(message, 0n)).toEqual(hash64(message));
        });
    });

    it('hashes to the same value regardless of seed type', () => {
        const withBuffer = hash64(
            message,
            Buffer.from([0x75, 0x8b, 0x0d, 0xec, 0xbc, 0xe8, 0x01, 0x7b]),
        );
        const withBigInt = hash64(message, 8863621439753653109n);
        expect(withBuffer).toStrictEqual(withBigInt);
    });

});
