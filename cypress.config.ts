import { defineConfig } from "cypress";
import path from "path";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
      webpackConfig: {
        resolve: {
          alias: {
            "@linkfolio": path.resolve(__dirname, "../src"),
          },
        },
      },
    },
  },
});
