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

🔧 Customizable components for maximum flexibility

## Installation

There are two methods to get started with Linkfolio:

### 1. Starting with the Linkfolio template

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&&install-command=npm%20install%20%20--legacy-peer-deps)

Edit the `user.config.ts` file in the `app` directory to personalize and tailor your profile to your preferences.

Using this method, you can quickly deploy a Linkfolio page with Vercel using the provided template.

### 2. Integrating into an existing Next.js project

Install the `linkfolio` package in your Next.js / Tailwind project:

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

## Usage

### Basic Usage

Here's a simple example of how to use the `<LinkFolio />` component with just the `userConfig`:

```javascript
import { LinkFolio } from "linkfolio";

const userConfig = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
  metaTitle: "LinkFolio",
  metaDescription: "A Hub for all your online links 🔗",
  socialNetworks: [
    {
      url: "https://github.com/{your_alias}",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Open-source contributions",
    },
    // Add more social networks here
  ],
};

function MyPage() {
  return <LinkFolio userConfig={userConfig} />;
}
```

This basic setup will create a Linkfolio page using the default components and styles.

### Customization Options

For more advanced customization, you can use the optional component props. Here's an example showing how to use custom components and add additional content:

```jsx
import { LinkFolio } from "linkfolio";
import MyCustomFooter from "./MyCustomFooter";

function MyPage() {
  return (
    <LinkFolio
      userConfig={userConfig}
      BeforeSocialLinksComponent={() => (
        <div className="mb-8 text-center">
          <h2>Welcome to my page!</h2>
          <p>Check out my social links below:</p>
        </div>
      )}
      AfterSocialLinksComponent={() => (
        <div className="mt-8 text-center">
          <h2>Thanks for visiting!</h2>
          <p>Feel free to connect with me on any platform.</p>
        </div>
      )}
      FooterComponent={MyCustomFooter}
    />
  );
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

## Theme Customization

To customize the theme, you can override the default CSS variables in your own CSS file. If you have installed `linkfolio` as a package, you can import the default styles and override the variables like this:

```css
@import "tailwindcss";
@import "linkfolio/dist/assets/globals.css";

@source "../node_modules/linkfolio/dist";

@theme {
  --color-primary: #937FA3;
  --color-secondary: #A56B8C;
  --color-background-start: #E8EFF7;
  --color-background-end: #EDE8F7;

  --background-image-gradient-background: linear-gradient(
    to bottom,
    var(--color-background-start),
    var(--color-background-end)
  );
}
```

If you are using the template, you can directly modify the `src/assets/globals.css` file.

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
