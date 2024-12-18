import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";

import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost",
    async setupNodeEvents(on, config) {
      // Set up the code coverage task
      codeCoverage(on, config);

      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });
      on("file:preprocessor", bundler);

      await addCucumberPreprocessorPlugin(on, config);
      return config;
    },
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/e2e/**/*.feature",
    ],
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
