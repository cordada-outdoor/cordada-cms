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
        let path = ctx.path;

        if (path.startsWith("/api/projects/")) {
          path = "/api/projects/:id";
        }

        if (path.startsWith("/api/clients/")) {
          path = "/api/clients/:id";
        }

        if (path.startsWith("/uploads/")) {
          path = "/uploads/:id";
        }

        return path;
      },
    },
  },
};
