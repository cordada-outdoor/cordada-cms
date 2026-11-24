import type { Core } from '@strapi/strapi';
import { generate } from '@strapi/openapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Generated on first request (routes are mounted by then) and cached for the process lifetime.
    let spec: unknown;

    strapi.server.router.get('/openapi.json', (ctx) => {
      spec ??= generate(strapi, { type: 'content-api' }).document;
      ctx.body = spec;
    });
  },
};
