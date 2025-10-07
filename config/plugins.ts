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

        // Content Manager - collection types with document IDs and actions
        path = path.replace(
          /\/content-manager\/collection-types\/(api::[^\/]+)\/([a-z0-9]+)(\/actions\/[^\/]+)?$/,
          "/content-manager/collection-types/$1/:id$3"
        );

        // Content Manager - relations with document IDs (the pattern causing "/content-manager/:id/...")
        path = path.replace(
          /\/content-manager\/relations\/(api::[^\/]+)\/([a-z0-9]+)\//,
          "/content-manager/relations/$1/:id/"
        );

        // Fix the incorrectly normalized routes (relations that got caught by another rule)
        // This handles routes like "/content-manager/:id/api::project.project/xxx/client"
        path = path.replace(
          /\/content-manager\/relations\/(api::[^\/]+)\/([^\/]+)$/,
          "/content-manager/relations/$1/:relation"
        );

        // Normalize single-type routes with actions
        path = path.replace(
          /\/content-manager\/single-types\/(api::[^\/]+)(\/actions\/[^\/]+)?$/,
          "/content-manager/single-types/$1$2"
        );

        // Normalize content-type configuration routes
        path = path.replace(
          /\/content-manager\/content-types\/(api::[^\/]+|plugin::[^\/]+)\/configuration$/,
          "/content-manager/content-types/:type/configuration"
        );

        return path;
      },
    },
  },
};
