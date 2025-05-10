import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'o4po9t',
  video: true,
  videoCompression: 32,
  videosFolder: "cypress/videos",

  e2e: {
    baseUrl: 'http://localhost:5173', 

    setupNodeEvents(on, config) {
      on("after:run", (results) => {
      });

      config.reporter = "mochawesome";
      config.reporterOptions = {
        reportDir: "cypress/reports/mocha",
        overwrite: true,
        html: true,
        json: true,
      };

      return config;
    },
  },
});
