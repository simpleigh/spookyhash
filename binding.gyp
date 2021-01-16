{
  "targets": [
    {
      "target_name": "spookyhash",
      "sources": [
        "src/spookyhash.cpp",
        "src/Hash.cpp",
        "src/SpookyV2.cpp"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include_dir\")"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      "conditions": [
        ["OS==\"mac\"", {
          "cflags+": ["-fvisibility=hidden"],
          "xcode_settings": {
            "GCC_SYMBOLS_PRIVATE_EXTERN": "YES"
          }
        }]
      ]
    }
  ]
}
