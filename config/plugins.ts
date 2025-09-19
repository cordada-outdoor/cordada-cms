// config/plugins.ts
export default {
  prometheus: {
    enabled: true,
    config: {
      collectDefaultMetrics: true,
      // labels: {
      //   app: "my-strapi-app",
      //   environment: process.env.NODE_ENV || "development"
      // },
      server: {
        port: parseInt(process.env.METRICS_PORT || "9000"),
        host: process.env.METRICS_HOST || "0.0.0.0",
        path: "/metrics",
      },

      // Custom normalization function (alternative to array rules)
      normalize: (ctx) => {
        let path = ctx.path;

        // Custom logic for your specific needs
        if (path.startsWith("/api/")) {
          path = path.replace(/\/\d+/g, "/:id"); // Replace numeric IDs
        }

        return path;
      },
    },
  },
};
