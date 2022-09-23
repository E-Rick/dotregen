# .Regen Domain Name Service

![Preview Image](https://raw.githubusercontent.com/E-Rick/dotregen/main/public/regen-preview2.png)

Built with:

- Custom Solidity contracts
- Chakra-ui
- Typescript
- WAGMI hooks

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or
preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-chakra-ui)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript&project-name=with-chakra-ui&repository-name=with-chakra-ui)

## How to use

### Using `create-next-app`

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with
[npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io)
to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
```

```bash
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

```bash
pnpm create next-app --example with-chakra-ui with-chakra-ui-app
```

Deploy it to the cloud with
[Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example)
([Documentation](https://nextjs.org/docs/deployment)).

## Notes

Chakra has supported Gradients and RTL in `v1.1`. To utilize RTL,
[add RTL direction and swap](https://chakra-ui.com/docs/features/rtl-support).

If you don't have multi-direction app, you should make `<Html lang="ar" dir="rtl">` inside `_document.ts`.
