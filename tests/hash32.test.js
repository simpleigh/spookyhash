/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hash32 } = require('..');
const {
    NOT_BIGINT,
    NOT_BUFFER,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('hash32 function', () => {

    const message = Buffer.from('test');

    it('exists', () => {
        expect(hash32).toBeDefined();
        expect(typeof hash32).toBe('function');
    });

    it('throws if not given a message', () => {
        expect(() => hash32()).toThrow();
    });

    it.each([
        ...NOT_BIGINT,
        ...NOT_NUMBER,
        ...NOT_OTHER,
    ])('throws if the message is %s', (name, value) => {
        expect(() => hash32(value)).toThrow();
    });

    it.each([
        ...NOT_BIGINT,
        ...NOT_BUFFER,
        ...NOT_OTHER,
    ])('throws if the seed is %s', (name, value) => {
        expect(() => hash32(message, value)).toThrow();
    });

    it('throws if given too many parameters', () => {
        expect(() => hash32(message, 0, 'extra')).toThrow();
    });

    it('returns a number', () => {
        expect(typeof hash32(message)).toBe('number');
    });

    it('hashes to a consistent value', () => {
        expect(hash32(message)).toEqual(3960310645);
    });

    it('hashes different messages to different values', () => {
        expect(hash32(message)).not.toEqual(hash32(Buffer.from('different')));
    });

    it('hashes to a new value if given a seed', () => {
        expect(hash32(message, 42)).not.toEqual(hash32(message));
    });

    it('uses 0 as a default value for the seed', () => {
        expect(hash32(message, 0)).toEqual(hash32(message));
    });

});
