import { httpRouter } from "convex/server";
import { receiveWebhook } from "./vsHttp";

const http = httpRouter();

http.route({
  path: "/receiveWebhook",
  method: "POST",
  handler: receiveWebhook,
});

export default http;
