import axios from "axios";

export default {
  async index(ctx) {
    const res = await axios.get("http://0.0.0.0:9000/metrics");

    ctx.status = 200;
    ctx.body = res.data;
  },
};
