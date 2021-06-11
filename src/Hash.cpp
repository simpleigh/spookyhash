/**
 * Node bindings for SpookyHash V2
 * @author Leigh Simpson <code@simpleigh.com>
 * @license MIT
 * @copyright Copyright 2020 Leigh Simpson. All rights reserved.
 */

#include <napi.h>
#include "spookyhash.h"


Napi::Object Hash::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "Hash", {
        InstanceMethod<&Hash::Digest>("digest"),
        InstanceMethod<&Hash::Update>("update"),
    });

    Napi::FunctionReference *constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(func);
    env.SetInstanceData<Napi::FunctionReference>(constructor);

    exports.Set("Hash", func);

    return exports;
}


Hash::Hash(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Hash>(info) {
    Napi::Env env = info.Env();

    bool lossless;
    uint64 seed1 = 0;
    uint64 seed2 = 0;

    CHECK_ARGUMENT_COUNT(0, 2, );

    if (info.Length() >= 1) {
        if (info[0].IsBuffer()) {
            LOAD_SEED_BUFFER(0, seed1, );
        } else if (info[0].IsBigInt()) {
            LOAD_SEED_BIGINT(0, seed1, );
        } else {
            Napi::TypeError::New(env, "first seed must be a BigInt or Buffer")
                .ThrowAsJavaScriptException();
            return;
        }
    }

    if (info.Length() >= 2) {
        if (info[1].IsBuffer()) {
            LOAD_SEED_BUFFER(1, seed2, );
        } else if (info[1].IsBigInt()) {
            LOAD_SEED_BIGINT(1, seed2, );
        } else {
            Napi::TypeError::New(env, "second seed must be a BigInt or Buffer")
                .ThrowAsJavaScriptException();
            return;
        }
    }

    m_state.Init(seed1, seed2);
}


Napi::Value Hash::Digest(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    CHECK_ARGUMENT_COUNT(0, 0, env.Null());

    uint64 hash1;
    uint64 hash2;

    m_state.Final(&hash1, &hash2);

    Napi::Buffer<uint64> result = Napi::Buffer<uint64>::New(env, 2);

    memcpy(result.Data(), &hash1, sizeof(uint64));
    memcpy(result.Data() + 1, &hash2, sizeof(uint64));

    return result;
}


void Hash::Update(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    CHECK_ARGUMENT_COUNT(1, 1, );

    CHECK_MESSAGE();

    m_state.Update(
        info[0].As<Napi::Buffer<uint8>>().Data(),
        info[0].As<Napi::Buffer<uint8>>().Length()
    );
}
