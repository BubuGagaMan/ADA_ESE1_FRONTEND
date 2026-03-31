import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://localhost:5173",
    setupNodeEvents(on, config) {},
    // hide fetch/XHR requests from the command log to keep it clean
    env: {
      hideXhr: true,
    },
  },
});
