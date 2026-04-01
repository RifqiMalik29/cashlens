module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@constants": "./src/constants",
            "@hooks": "./src/hooks",
            "@screens": "./src/screens",
            "@services": "./src/services",
            "@stores": "./src/stores",
            "@types": "./src/types",
            "@utils": "./src/utils"
          },
          extensions: [
            ".ios.js",
            ".android.js",
            ".js",
            ".ts",
            ".tsx",
            ".json"
          ]
        }
      ]
    ]
  };
};
