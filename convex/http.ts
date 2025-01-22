import { httpRouter } from "convex/server";
import { receiveWebhook } from "./vsHttp";

const http = httpRouter();

http.route({
  path: "/receiveWebhook",
  method: "GET",
  handler: receiveWebhook,
});

export default http;
