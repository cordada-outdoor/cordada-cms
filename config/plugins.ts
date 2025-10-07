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

        // API routes with IDs
        if (path.startsWith("/api/projects/")) {
          path = "/api/projects/:id";
        }
        if (path.startsWith("/api/clients/")) {
          path = "/api/clients/:id";
        }

        // Upload routes
        if (path.startsWith("/uploads/")) {
          path = "/uploads/:id";
        }

        // Admin static assets (hashed bundles)
        if (
          path.startsWith("/admin/") &&
          path.match(/\/admin\/[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+\.(js|css)$/)
        ) {
          path = "/admin/:asset";
        }

        // Content Manager - individual project IDs
        if (
          path.match(
            /^\/content-manager\/collection-types\/api::project\.project\/[a-z0-9]+$/
          )
        ) {
          path = "/content-manager/collection-types/api::project.project/:id";
        }

        // Content Manager - individual service IDs
        if (
          path.match(
            /^\/content-manager\/collection-types\/api::service\.service\/[a-z0-9]+$/
          )
        ) {
          path = "/content-manager/collection-types/api::service.service/:id";
        }

        // Content Manager - project relations
        if (
          path.match(
            /^\/content-manager\/relations\/api::project\.project\/[a-z0-9]+\//
          )
        ) {
          path = path.replace(/\/[a-z0-9]+\//, "/:id/");
        }

        return path;
      },
    },
  },
};
