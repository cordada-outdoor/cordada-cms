export default {
  async index(ctx) {
    const res = await fetch("http://0.0.0.0:9000/metrics");

    ctx.status = 200;
    ctx.body = await res.text();
  },
};
