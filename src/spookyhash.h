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
