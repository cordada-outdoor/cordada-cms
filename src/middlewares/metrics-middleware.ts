import promBundle from "express-prom-bundle";

export default (config, { strapi }) => {
  // Configure express-prom-bundle
  const metricsMiddleware = promBundle({
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
      const path = (req.originalUrl || req.url || "").split("?")[0];
      return !path.match(/^\/api/);
    },
    // Normalize paths to avoid high cardinality
    normalizePath: (req, opts) => {
      // Remove IDs and other variable parts from paths
      const path = req.originalUrl
        .replace(/\/\d+/g, "/:id")
        .replace(/\/[0-9a-f]{24}/g, "/:id") // MongoDB ObjectIds
        .replace(/\/[0-9a-f-]{36}/g, "/:id"); // UUIDs

      return path;
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
