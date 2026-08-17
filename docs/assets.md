# Bundled assets

Importing the shipped icons, stylesheet and fonts, and overriding them.

## Importing the bundled assets

The package ships the default icon set and the stylesheet:

```ts
import { githubIcon, defaultAvatarIcon } from "linkfolio/assets";
```

```css
@import "linkfolio/assets/globals.css";
```

Linkfolio uses TailwindCSS for styling. If you wish to customize styles, you can use the default Tailwind configuration `tailwind.config.ts` provided with the package.

Linkfolio uses the `Raleway` font by default. If you wish to change the font, you can update the `font-family` in `layout.tsx`:

```javascript
import { Roboto } from "next/font/google";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
```

To customize the theme, you can override the default CSS variables in your own CSS file. If you have installed `linkfolio` as a package, you can import the default styles and override the variables like this:

```css
@import "tailwindcss";
@import "linkfolio/dist/assets/globals.css";

@source "../node_modules/linkfolio/dist";

@theme {
  --color-primary: #937fa3;
  --color-secondary: #a56b8c;
  --color-background-start: #e8eff7;
  --color-background-end: #ede8f7;

  --background-image-gradient-background: linear-gradient(
    to bottom,
    var(--color-background-start),
    var(--color-background-end)
  );
}
```

If you are using the template, you can directly modify the `src/assets/globals.css` file.

---

[← Back to the README](../README.md)
