import { defineConfig } from "cypress";
import mochawesome from "mochawesome";

export default defineConfig({
  projectId: "o4po9t",
  
  // Habilitar grabación de videos (nivel raíz)
  video: true,
  videoCompression: 32, // Opcional: compresión (1-51, menor = mejor calidad)
  videosFolder: "cypress/videos", // Opcional: carpeta personalizada

  e2e: {
    setupNodeEvents(on, config) {
      on("after:run", (results) => {});

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