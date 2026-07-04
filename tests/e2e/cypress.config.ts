import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    screenshotOnRunFailure: true,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    viewportWidth: 1440,
    viewportHeight: 900,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createEsbuildPlugin({
        plugins: [],
      }));
      return config;
    },
  },
});
