# Create Ersn App

A simple and interactive CLI for setting up projects using personal starter templates. The templates are stored in separate repositories, making them easy to clone and use. More templates will be added over time as needed.

## Installation

You can install `create-ersn-app` globally using:

```bash
pnpm add -g create-ersn-app
# or
npm install -g create-ersn-app
# or
yarn global add create-ersn-app
# or
bun add -g create-ersn-app
```

Alternatively, you can run it directly using `npx`, `pnpm dlx`, `yarn dlx`, or `bunx`:

```bash
npx create-ersn-app
# or
pnpm dlx create-ersn-app
# or
yarn dlx create-ersn-app
# or
bunx create-ersn-app
```

## Usage

### Interactive Mode

Simply run the following command and follow the prompts:

```bash
create-ersn-app
```

You'll be asked to select a template and provide the project name.

<!-- ### Non-Interactive Mode

You can also specify the template and project name directly in the command line:

```bash
create-ersn-app my-project --template <template-key>
``` -->

## Available Templates

Here are some of the templates you can use:

- **Nuxt 3 Basic Starter**: `nuxt3-basic-starter`

More templates will be added in the future!

## Requirements

- **Node.js**: v20.19.0 or later
- **Package Manager**: `pnpm`, `npm`, `yarn`, or `bun`

## Features

- 🚀 **Easy Setup** – Quickly scaffold a new project
- 🔥 **Multiple Templates** – Use different starter templates for various projects
- 🎨 **Beautiful CLI** – Uses `@clack/prompts` and `chalk` for an enhanced user experience
- ⚡ **Fast & Lightweight** – Uses `esbuild` for optimized performance

## License

This project is licensed under the **MIT License**.

## Author

Created by **Ersan Karimi** – [Website](https://ersankarimi.vercel.app)
