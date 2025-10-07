// config/plugins.ts
export default {
  prometheus: {
    enabled: true,
    config: {
      labels: {
        service: "cordada_cms",
        environment: process.env.NODE_ENV || "development",
      },
      server: {
        port: parseInt(process.env.METRICS_PORT || "9000"),
        host: process.env.METRICS_HOST || "0.0.0.0",
        path: "/metrics",
      },

      // Custom normalization function (alternative to array rules)
      normalize: (ctx) => {
        const path = ctx.path;

        // API routes with IDs
        if (path.startsWith("/api")) {
          if (path.startsWith("/api/projects/")) {
            return "/api/projects/:id";
          }

          if (path.startsWith("/api/clients/")) {
            return "/api/clients/:id";
          }

          return path;
        }

        return "ignore";
      },
    },
  },
};
