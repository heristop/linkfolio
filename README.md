# LinkFolio

![LinkFolio](https://github.com/heristop/linkfolio/blob/main/docs/linkfolio.png?raw=true)

A sleek, minimalist landing page that connects your audience to all of your online presences.

## Preview

![Preview](https://github.com/heristop/linkfolio/blob/main/docs/preview.jpg?raw=true)

## Features

🚀 Built with Next.js for optimal performance

💅 Styled using TailwindCSS for a modern look

🛠️ Easy configuration to add or remove links

## Performance

![Lighthouse](https://github.com/heristop/linkfolio/blob/main/docs/lighthouse.png?raw=true)

## Installation:

There are two methods to get started with LinkFolio:

### 1. Starting with the LinkFolio template

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&&install-command=npm%20install%20%20--legacy-peer-deps)

Edit the `user.config.ts` file in the `app` directory to personalize and tailor your profile to your preferences.

Using this method, you can quickly deploy a LinkFolio page with Vercel using the provided template.

### 2. Integrating into an existing Next.js project

**Installation**

Install LinkFolio in your Next.js / Tailwind project:

```bash
npm install linkfolio
```

Or using Yarn / Pnpm:

```bash
yarn add linkfolio
```

```bash
pnpm add linkfolio
```

**Implementation**

Import and utilize the `LinkFolio` component in your project:

```javascript
import { LinkFolio } from "linkfolio";
```

Add your configuration:

```javascript
const userConfig = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
  metaTitle: "LinkFolio",
  metaDescription: "LinkFolio",
  socialNetworks: [
    {
      url: "https://github.com/{your_alias}",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Open-source contributions",
    },
  ],
};

function MyPage() {
  return <LinkFolio userConfig={userConfig} />;
}
```

## Customizing Styles with TailwindCSS

LinkFolio uses TailwindCSS for styling. If you wish to customize styles, you can use the default Tailwind configuration `tailwind.config.ts` provided with the package.

## Testing with Playwright

To ensure the integrity and functionality of the project, we utilize Playwright for end-to-end testing.

### Running Tests

To execute the Playwright tests, run the following command:

```
npx playwright test
```

### Updating Reference Snapshots

As the project evolves, you might update the UI or functionality, causing the existing reference snapshots to be outdated. In such cases, you'll need to update the snapshots to match the latest changes.

To update the reference snapshots, run:

```
npx playwright test --update-snapshots
```

This will run the tests and update any snapshots that don't match the current render of your page.

## Example Usage

For a practical implementation of LinkFolio, check out my example repository: [My LinkFolio Page](https://github.com/heristop/my-linkfolio).

This repository demonstrates how to integrate and customize LinkFolio in a Next.js project.

## Contribution

If you have ideas to improve or found a bug, do not hesitate to create an issue or submit a pull request.

## License

LinkFolio is open-sourced under the [MIT License](LICENSE).
