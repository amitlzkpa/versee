"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

import * as docusign from "docusign-esign";

export const testAction_debugOne = action({
  handler: async (ctx) => {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const apiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const integratorKey = "e612e007-3539-464a-a972-797c81ce2088";
    const RedirectURI = "https://versee.vercel.app/callback/docusign";
    const oauthLoginUrl = apiClient.getJWTUri(integratorKey, RedirectURI, oAuthBasePath);

    return oauthLoginUrl;
  }
});

export const testAction_debugTwo = action({
  args: {
    authCode: v.string(),
  },
  handler: async (ctx, { authCode }) => {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const apiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const IntegratorKeyAuthCode = "e612e007-3539-464a-a972-797c81ce2088";
    const ClientSecret = "603aed07-5ede-409c-8246-4539a219e1c2";
    const code = authCode;

    console.log("======================================");
    console.log("code");
    console.log(code);

    const token = await apiClient.generateAccessToken(IntegratorKeyAuthCode, ClientSecret, code);
    return token;
  }
});

export const testAction_reverseText = action({
  args: {
    inputText: v.string(),
  },
  handler: async (ctx, { inputText }) => {
    const outputText = inputText.split("").reverse().join("");
    return outputText;
  },
});

export const testAction_deleteMsgs = action({
  handler: async (ctx) => {
    const deleteMessageIds: any[] = await ctx.runMutation(internal.dbOps.deleteMsgs);
    return deleteMessageIds;
  },
});
