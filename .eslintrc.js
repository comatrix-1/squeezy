// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo"],
  rules: {
    'import/no-unresolved': 'off',
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        name: "react-redux",
        importNames: ["useSelector", "useDispatch"],
        message:
          "Use typed hooks `useAppDispatch` and `useAppSelector` instead.",
      },
    ],
  },
};
