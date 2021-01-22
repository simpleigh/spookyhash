/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

#include <napi.h>
#include "SpookyV2.h"


class Hash : public Napi::ObjectWrap<Hash> {
    public:
        static Napi::Object Init(Napi::Env env, Napi::Object exports);

        Hash(const Napi::CallbackInfo& info);

    private:
        SpookyHash m_state;

        Napi::Value Digest(const Napi::CallbackInfo& info);
        void Update(const Napi::CallbackInfo& info);
};


Napi::Value Hash128(const Napi::CallbackInfo& info);
Napi::Value Hash64(const Napi::CallbackInfo& info);
Napi::Value Hash32(const Napi::CallbackInfo& info);

Napi::Object Init(Napi::Env env, Napi::Object exports);


/**
 * Checks the count of arguments passed to a function
 * @param {size_t}             min     Minimum number of arguments permitted
 * @param {size_t}             max     Maximum number of arguments permitted
 * @param {?}                  retval  Value to return from the function
 * @param {Napi::CallbackInfo} info    Callback info (defined outside the macro)
 */
#define CHECK_ARGUMENT_COUNT(min, max, retval) \
    if (info.Length() < (min) || info.Length() > (max)) { \
        Napi::TypeError::New(info.Env(), "Wrong number of arguments") \
            .ThrowAsJavaScriptException(); \
        return retval; \
    }


/**
 * Checks that the first argument passed to a function is a message buffer
 * @param {?}                  retval  Value to return from the function
 * @param {Napi::CallbackInfo} info    Callback info (defined outside the macro)
 */
#define CHECK_MESSAGE(retval) \
    if (!info[0].IsBuffer()) { \
        Napi::TypeError::New(info.Env(), "message must be a Buffer") \
            .ThrowAsJavaScriptException(); \
        return retval; \
    }


/**
 * Loads a BigInt into a seed variable
 * @param {size_t}  arg     Argument number to load
 * @param {*uint64} seed    Name of seed variable to store value
 * @param {?}       retval  Value to return from the function
 */
#define LOAD_SEED_BIGINT(arg, seed, retval) { \
    bool lossless; \
    (seed) = info[(arg)].As<Napi::BigInt>().Uint64Value(&lossless); \
    if (!lossless) { \
        Napi::TypeError::New(env, "BigInt seed must convert to Uint64") \
            .ThrowAsJavaScriptException(); \
        return retval; \
    } \
}


/**
 * Loads a Buffer into a seed variable
 * @param {size_t}  arg     Argument number to load
 * @param {*uint64} seed    Name of seed variable to store value
 * @param {?}       retval  Value to return from the function
 */
#define LOAD_SEED_BUFFER(arg, seed, retval) { \
    Napi::Buffer<uint8> buf = info[(arg)].As<Napi::Buffer<uint8>>(); \
    if (buf.Length() != 8) { \
        Napi::TypeError::New(env, "Buffer seed must have 8 bytes") \
            .ThrowAsJavaScriptException(); \
        return retval; \
    } \
    memcpy(&(seed), buf.Data(), sizeof(uint64)); \
}
