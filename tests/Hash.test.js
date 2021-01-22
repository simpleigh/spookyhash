/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

const { hasBigInt, Hash, hash128 } = require('..');
const {
    NOT_BIGINT,
    NOT_BUFFER,
    NOT_INVALID_BIGINT,
    NOT_NUMBER,
    NOT_OTHER,
} = require('./fixtures');

describe('Hash class', () => {

    const message = Buffer.from('test');

    it('exists', () => {
        expect(Hash).toBeDefined();
        expect(typeof Hash).toBe('function');
    });

    it('can be created', () => {
        new Hash();
        // test succeeds if no errors
    });

    it('has digest and update methods', () => {
        const hash = new Hash();
        expect(hash).toHaveProperty('digest');
        expect(hash).toHaveProperty('update');
        expect(typeof hash.digest).toBe('function');
        expect(typeof hash.update).toBe('function');
    });

    describe('constructor', () => {
        it.each([
            ...NOT_BUFFER,
            ...NOT_INVALID_BIGINT,
            ...NOT_NUMBER,
            ...NOT_OTHER,
        ])('throws if the first seed is %s', (name, value) => {
            expect(() => new Hash(value)).toThrow();
        });

        it.each([
            ...NOT_BUFFER,
            ...NOT_INVALID_BIGINT,
            ...NOT_NUMBER,
            ...NOT_OTHER,
        ])('throws if the second seed is %s', (name, value) => {
            expect(() => new Hash(Buffer.alloc(8), value)).toThrow();
        });

        it('throws if given too many parameters', () => {
            expect(() => new Hash(Buffer.alloc(8), Buffer.alloc(8), 'extra')).toThrow();
        });
    });

    describe('update', () => {
        it('throws if not given a message', () => {
            const hash = new Hash();
            expect(() => hash.update()).toThrow();
        });

        it.each([
            ...NOT_BIGINT,
            ...NOT_NUMBER,
            ...NOT_OTHER,
        ])('throws if the message is %s', (name, value) => {
            const hash = new Hash();
            expect(() => hash.update(value)).toThrow();
        });

        it('throws if given too many parameters', () => {
            const hash = new Hash();
            expect(() => hash.update(Buffer.alloc(0), 'extra')).toThrow();
        });

        it('returns undefined', () => {
            const hash = new Hash();
            expect(hash.update(Buffer.alloc(0))).toBeUndefined();
        });
    });

    describe('digest', () => {
        it('throws if given too many parameters', () => {
            const hash = new Hash();
            expect(() => hash.digest('extra')).toThrow();
        });

        it('returns a buffer of the correct length', () => {
            const hash = new Hash();
            expect(hash.digest()).toHaveLength(16);
        });
    });

    it('starts out hashing an empty buffer', () => {
        const hash = new Hash();
        expect(hash.digest()).toEqual(hash128(Buffer.alloc(0)));
    });

    it('returns the same empty buffer hash when called again', () => {
        const hash = new Hash();
        const result = hash.digest();

        expect(hash.digest()).toEqual(result);
    });

    it('hashes a test buffer to a consistent value', () => {
        const expected = Buffer.from([
            0x75, 0x8b, 0x0d, 0xec, 0xbc, 0xe8, 0x01, 0x7b,
            0x60, 0xac, 0xff, 0xd5, 0xa8, 0x98, 0x6f, 0x0b,
        ]);
        const hash = new Hash();
        hash.update(message);

        expect(hash.digest()).toEqual(expected);
    });

    it('returns the same test buffer hash when called again', () => {
        const hash = new Hash();
        hash.update(message);
        const result = hash.digest();

        expect(hash.digest()).toEqual(result);
    });

    it('hashes different messages to different values', () => {
        const hash1 = new Hash();
        const hash2 = new Hash();

        hash1.update(message);
        hash2.update(Buffer.from('different'));

        expect(hash1.digest()).not.toEqual(hash2.digest());
    });

    describe('Buffer seed', () => {
        it('hashes to a new value if given a first seed', () => {
            const seed1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const hash1 = new Hash(seed1);
            const hash2 = new Hash();

            hash1.update(message);
            hash2.update(message);

            expect(hash1.digest()).not.toEqual(hash2.digest());
        });

        it('hashes to a new value if given a second seed', () => {
            const seed1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const seed2 = Buffer.from([9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0]);
            const hash1 = new Hash(seed1, seed2);
            const hash2 = new Hash(seed1);

            hash1.update(message);
            hash2.update(message);

            expect(hash1.digest()).not.toEqual(hash2.digest());
        });

        it('uses 0 as a default value for both seeds', () => {
            const hash1 = new Hash(Buffer.alloc(8), Buffer.alloc(8));
            const hash2 = new Hash();

            hash1.update(message);
            hash2.update(message);

            expect(hash1.digest()).toEqual(hash2.digest());
        });
    });

    if (hasBigInt) {
        describe('BigInt seed', () => {
            it('hashes to a new value if given a first seed', () => {
                const hash1 = new Hash(42n);
                const hash2 = new Hash();

                hash1.update(message);
                hash2.update(message);

                expect(hash1.digest()).not.toEqual(hash2.digest());
            });

            it('hashes to a new value if given a second seed', () => {
                const hash1 = new Hash(42n, 43n);
                const hash2 = new Hash(42n);

                hash1.update(message);
                hash2.update(message);

                expect(hash1.digest()).not.toEqual(hash2.digest());
            });

            it('uses 0 as a default value for both seeds', () => {
                const hash1 = new Hash(0n, 0n);
                const hash2 = new Hash();

                hash1.update(message);
                hash2.update(message);

                expect(hash1.digest()).toEqual(hash2.digest());
            });
        });

        it('hashes to the same value regardless of seed type', () => {
            const hash1 = new Hash(
                Buffer.from([0x75, 0x8b, 0x0d, 0xec, 0xbc, 0xe8, 0x01, 0x7b]),
                Buffer.from([0x60, 0xac, 0xff, 0xd5, 0xa8, 0x98, 0x6f, 0x0b]),
            );
            const hash2 = new Hash(8863621439753653109n, 824045107744320608n);

            hash1.update(message);
            hash2.update(message);

            expect(hash1.digest()).toEqual(hash2.digest());
        });
    }

    it('hashes to a new value if given more data', () => {
        const hash = new Hash();
        hash.update(message);
        const result = hash.digest();
        hash.update(Buffer.from('new'));

        expect(hash.digest()).not.toEqual(result);
    });

});
