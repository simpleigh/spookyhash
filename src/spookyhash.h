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
