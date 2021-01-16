/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hash64 } = require('..');
const {
    NOT_BIGINT,
    NOT_BUFFER,
    NOT_INVALID_BIGINT,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('hash64 function', () => {

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
        ...NOT_BUFFER,
        ...NOT_INVALID_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the seed is %s', (name, value) => {
        expect(() => hash64(Buffer.from('test'), value)).toThrow();
    });

    it('throws if given too many parameters', () => {
        expect(() => hash64(Buffer.from('test'), 0n, 'extra')).toThrow();
    });

    it('returns a BigInt', () => {
        expect(typeof hash64(Buffer.from('test'))).toBe('bigint');
    });

    it('hashes to a consistent value', () => {
        expect(hash64(Buffer.from('test'))).toEqual(8863621439753653109n);
    });

    it('hashes different messages to different values', () => {
        expect(hash64(Buffer.from('test')))
            .not.toEqual(hash64(Buffer.from('different')));
    });

    it('hashes to a new value if given a seed', () => {
        expect(hash64(Buffer.from('test'), 42n))
            .not.toEqual(hash64(Buffer.from('test')));
    });

    it('uses 0 as a default value for the seed', () => {
        expect(hash64(Buffer.from('test'), 0n))
            .toEqual(hash64(Buffer.from('test')));
    });

});
