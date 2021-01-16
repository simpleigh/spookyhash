# Contributing

To install locally:

```shell
yarn install
yarn test
```

To rebuild the Node.JS addon:

```shell
yarn build
```

## Node headers

To download headers for the current Node version:

```shell
yarn headers
```

These are downloaded to the `include` directory for inspection or for use by
your IDE.
`node-addon-api` also has a separate set of headers.
If you're using [Visual Studio Code](https://code.visualstudio.com/) then you
can configure this by adding a file at `.vscode/settings.json` as follows:

```json
{
  "C_Cpp.default.includePath": [
    "${workspaceFolder}/**",
    "${workspaceFolder}/node_modules/node-addon-api"
  ]
}
```

## References

* [Node.js - C++ addons](https://nodejs.org/docs/latest-v14.x/api/addons.html)
* [Node.js - N-API](https://nodejs.org/docs/latest-v14.x/api/n-api.html)
* [`node-addon-api`](https://github.com/nodejs/node-addon-api)
* [Jest](https://jestjs.io/docs/en/getting-started.html)
* [`node-spookyhash-v2`](https://github.com/nathankellenicki/node-spookyhash-v2)
