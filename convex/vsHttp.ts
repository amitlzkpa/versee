import { httpAction } from "./_generated/server";

export const receiveWebhook = httpAction(async (ctx, request) => {
  const msg = await request.json();

  console.log("webhook received");
  console.log(msg);

  return new Response("webhook received", {
    status: 200,
  });
});
