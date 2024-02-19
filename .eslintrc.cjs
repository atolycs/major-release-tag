module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  plugins: [
    "jest"
  ],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style"
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    indent: ["warn", 2],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
  },
};
