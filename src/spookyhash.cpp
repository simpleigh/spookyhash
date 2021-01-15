/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

#include <napi.h>
#include "SpookyV2.h"


Napi::Value Hash128(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    bool lossless;
    uint64 hash1;
    uint64 hash2;

    if (info.Length() < 1 || info.Length() > 3) {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsBuffer()) {
        Napi::TypeError::New(env, "message must be a Buffer")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (info.Length() > 1) {
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
    } else {
        hash1 = 0;
    }

    if (info.Length() > 2) {
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
    } else {
        hash2 = 0;
    }

    SpookyHash::Hash128(
        info[0].As<Napi::Buffer<void>>().Data(),
        info[0].As<Napi::Buffer<void>>().Length(),
        &hash1,
        &hash2
    );

    Napi::Buffer<void> result = Napi::Buffer<void>::New(env, 16);

    memcpy(result.Data(), &hash1, 8);
    memcpy(result.Data() + 8, &hash2, 8);

    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        Napi::String::New(env, "hash128"),
        Napi::Function::New<Hash128>(env)
    );

    return exports;
}


NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
