# Linkfolio

Linkfolio is an elegant, minimalist landing page that connects your audience to all of your online presences.

![Linkfolio](https://github.com/heristop/linkfolio/blob/main/docs/linkfolio.png?raw=true)

## Preview

![Preview](https://github.com/heristop/linkfolio/blob/main/docs/preview.jpg?raw=true)

## Features

🚀 Built with Next.js for optimal performance

💅 Styled using TailwindCSS for a modern look

🛠️ Easy configuration to add or remove links

📱 Responsive design for all devices

## Installation

There are two methods to get started with Linkfolio:

### 1. Starting with the Linkfolio template

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&&install-command=npm%20install%20%20--legacy-peer-deps)

Edit the `user.config.ts` file in the `app` directory to personalize and tailor your profile to your preferences.

Using this method, you can quickly deploy a Linkfolio page with Vercel using the provided template.

### 2. Integrating into an existing Next.js project

Install `linkfolio` package in your Next.js / Tailwind project:

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
  metaTitle: "Linkfolio",
  metaDescription: "Linkfolio",
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

## Configuration

The `user.config.ts` file allows you to customize your Linkfolio. Here are the main available options:

- `avatarSrc`: Path to your profile image
- `avatarAlt`: Alternative text for the profile image
- `fullName`: Your full name
- `alias`: Your alias or username
- `metaTitle`: Page title (for SEO)
- `metaDescription`: Page description (for SEO)
- `socialNetworks`: An array of objects representing your social networks
- `enableTypingAlias`: Enable typewriter effect on alias (boolean)

Example of adding the typewriter effect on the alias:

```javascript
const userConfig = {
  // ... other configurations
  enableTypingAlias: true,
};
```

## Customizing Styles with TailwindCSS

Linkfolio uses TailwindCSS for styling. If you wish to customize styles, you can use the default Tailwind configuration `tailwind.config.ts` provided with the package.

## Customizing Fonts

Linkfolio uses the `Raleway` font by default. If you wish to change the font, you can update the `font-family` in `layout.tsx`:

```javascript
import { Roboto } from "next/font/google";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
```

## Testing with Playwright

To ensure the integrity and functionality of the project, we utilize Playwright for end-to-end testing.

### Running Tests

To execute the Playwright tests, run the following command:

```bash
npx playwright test
```

### Updating Reference Snapshots

As the project evolves, you might update the UI or functionality, causing the existing reference snapshots to be outdated. In such cases, you'll need to update the snapshots to match the latest changes.

To update the reference snapshots, run:

```bash
npx playwright test --update-snapshots
```

This will run the tests and update any snapshots that don't match the current render of your page.

## Configuration API

Linkfolio exposes a public API to access the user configuration. You can access it via the `/api/config` route. This API returns the configuration data in JSON format, which can be useful for:

- Dynamically integrating your Linkfolio information into other parts of your application
- Allowing third-party applications to fetch your Linkfolio data
- Debugging purposes
- Creating custom widgets or extensions that use your Linkfolio data

Example usage:

```javascript
fetch("https://your-linkfolio-site.com/api/config")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

> [!TIP]
>
> Since this API is public, ensure that you don't include any sensitive information in your Linkfolio configuration that you wouldn't want to be publicly accessible.

## Example Usage

For a practical implementation of Linkfolio, check out my example repository: [My Linkfolio Page](https://github.com/heristop/my-linkfolio).

This repository demonstrates how to integrate and customize Linkfolio in a Next.js project.

## Contribution

If you have ideas to improve or found a bug, do not hesitate to create an issue or submit a pull request.

## License

Linkfolio is open-sourced under the [MIT License](LICENSE).
