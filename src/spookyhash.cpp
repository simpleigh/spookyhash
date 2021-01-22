/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

#include <napi.h>
#include "spookyhash.h"


Napi::Value Hash128(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    bool lossless;
    uint64 hash1 = 0;
    uint64 hash2 = 0;

    CHECK_ARGUMENT_COUNT(1, 3, env.Null());

    CHECK_MESSAGE(env.Null());

    if (info.Length() >= 2) {
        if (!info[1].IsBigInt()) {
            Napi::TypeError::New(env, "first seed must be a BigInt")
                .ThrowAsJavaScriptException();
            return env.Null();
        }

        hash1 = info[1].As<Napi::BigInt>().Uint64Value(&lossless);

        if (!lossless) {
            Napi::TypeError::New(env, "first seed must convert to Uint64")
                .ThrowAsJavaScriptException();
            return env.Null();
        }
    }

    if (info.Length() >= 3) {
        if (!info[2].IsBigInt()) {
            Napi::TypeError::New(env, "second seed must be a BigInt")
                .ThrowAsJavaScriptException();
            return env.Null();
        }

        hash2 = info[2].As<Napi::BigInt>().Uint64Value(&lossless);

        if (!lossless) {
            Napi::TypeError::New(env, "second seed must convert to Uint64")
                .ThrowAsJavaScriptException();
            return env.Null();
        }
    }

    SpookyHash::Hash128(
        info[0].As<Napi::Buffer<uint8>>().Data(),
        info[0].As<Napi::Buffer<uint8>>().Length(),
        &hash1,
        &hash2
    );

    Napi::Buffer<uint64> result = Napi::Buffer<uint64>::New(env, 2);

    memcpy(result.Data(), &hash1, sizeof(uint64));
    memcpy(result.Data() + 1, &hash2, sizeof(uint64));

    return result;
}


Napi::Value Hash64(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    bool lossless;
    uint64 seed = 0;

    CHECK_ARGUMENT_COUNT(1, 2, env.Null());

    CHECK_MESSAGE(env.Null());

    if (info.Length() >= 2) {
        if (!info[1].IsBigInt()) {
            Napi::TypeError::New(env, "seed must be a BigInt")
                .ThrowAsJavaScriptException();
            return env.Null();
        }

        seed = info[1].As<Napi::BigInt>().Uint64Value(&lossless);

        if (!lossless) {
            Napi::TypeError::New(env, "seed must convert to Uint64")
                .ThrowAsJavaScriptException();
            return env.Null();
        }
    }

    uint64 hash = SpookyHash::Hash64(
        info[0].As<Napi::Buffer<uint8>>().Data(),
        info[0].As<Napi::Buffer<uint8>>().Length(),
        seed
    );

    Napi::BigInt result = Napi::BigInt::New(env, hash);

    return result;
}


Napi::Value Hash32(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    uint32 seed = 0;

    CHECK_ARGUMENT_COUNT(1, 2, env.Null());

    CHECK_MESSAGE(env.Null());

    if (info.Length() >= 2) {
        if (!info[1].IsNumber()) {
            Napi::TypeError::New(env, "seed must be a number")
                .ThrowAsJavaScriptException();
            return env.Null();
        }

        seed = info[1].As<Napi::Number>().Uint32Value();
    }

    uint32 hash = SpookyHash::Hash64(
        info[0].As<Napi::Buffer<uint8>>().Data(),
        info[0].As<Napi::Buffer<uint8>>().Length(),
        seed
    );

    Napi::Number result = Napi::Number::New(env, hash);

    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    Hash::Init(env, exports);

    exports.Set(
        Napi::String::New(env, "hash128"),
        Napi::Function::New<Hash128>(env)
    );

    exports.Set(
        Napi::String::New(env, "hash64"),
        Napi::Function::New<Hash64>(env)
    );

    exports.Set(
        Napi::String::New(env, "hash32"),
        Napi::Function::New<Hash32>(env)
    );

    return exports;
}


NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
