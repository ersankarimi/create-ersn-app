import antfu from "@antfu/eslint-config";

export default antfu({
  yaml: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  rules: {
    "no-console": "off",
  },
});
