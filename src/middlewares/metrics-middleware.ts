import promBundle from "express-prom-bundle";

export default (config, { strapi }) => {
  // Configure express-prom-bundle
  const metricsMiddleware = promBundle({
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15],
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: {
      service: "cordada_cms",
    },
    formatStatusCode: (res) => {
      return `${res.statusCode.toString().charAt(0)}xx`;
    },
    promClient: {
      collectDefaultMetrics: {
        timeout: 1000,
      },
    },
    bypass: (req) => {
      const path = req.url.split("?")[0];
      return !path.match(/^\/api/);
    },
    // Normalize paths to avoid high cardinality
    normalizePath: (req) => {
      // Remove IDs and other variable parts from paths
      const path = req.url.split("?")[0];

      return path
        .replace(/\/\d+/g, "/:id")
        .replace(/\/[0-9a-f]{24}/g, "/:id") // MongoDB ObjectIds
        .replace(/\/[0-9a-f-]{36}/g, "/:id") // UUIDs
        .replace(/\/[a-z0-9]{20,}/gi, "/:id");
    },
    ...config,
  });

  return async (ctx, next) => {
    // Convert Koa context to Express-like req/res
    await new Promise<void>((resolve) => {
      metricsMiddleware(ctx.req, ctx.res, () => {
        resolve();
      });
    });

    await next();
  };
};
