const { defineConfig } = require('orval');

module.exports = defineConfig({
  api: {
    input: 'http://localhost:3001/api-json',
    output: {
      mode: 'split',
      target: 'src/api/generated/index.ts',
      schemas: 'src/api/generated/schemas',
      client: 'axios',
      override: {
        mutator: {
          path: 'src/shared/api/apiClient.ts',
          name: 'apiClientRequest',
        },
        zod: {
          generate: true,
        },
      },
    },
  },
});
