// @ts-nocheck
"use node";
import * as https from "https";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as docusign from "docusign-esign";

export const testAction_createNewProject = action({
  handler: async (ctx) => {
    const newProject: any = await ctx.runMutation(internal.dbOps.createNewProject);
    return newProject;
  }
});

export const testAction_startDocusignOAuth = action({
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

export const testAction_getAccessToken = action({
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

    const oAuthToken = await apiClient.generateAccessToken(IntegratorKeyAuthCode, ClientSecret, code);
    const userInfo = await apiClient.getUserInfo(oAuthToken.accessToken);
    const docusignDataStr = JSON.stringify({ oAuthToken, userInfo });
    const storedData: any = await ctx.runMutation(internal.dbOps.upsertDocusignDataForUser, { docusignDataStr });
    return storedData;
  }
});

async function downloadFileAsBytes(url: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

export const testAction_sendSigningEmail = action({
  handler: async (ctx) => {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const dsApiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const storedDocusignData = await ctx.runQuery(internal.dbOps.getDocusignData);
    const accountId = storedDocusignData.userInfo.accounts[0].accountId;
    const accessToken = storedDocusignData.oAuthToken.accessToken;

    const storageId = "kg20kf8cv8m6stc4nct8cbdbah781b38" as Id<"_storage">;
    const docUrl = (await ctx.runAction(api.uploadedFiles.generateViewUrl, { storageId })) ?? "";
    const docBytes = await downloadFileAsBytes(docUrl);
    const doc3b64 = Buffer.from(docBytes).toString('base64');

    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Please Sign my Node SDK Envelope';
    envDef.emailBlurb = 'Hello, Please sign my Node SDK Envelope.';

    // add a document to the envelope
    const doc = new docusign.Document();
    const base64Doc = doc3b64;
    doc.documentBase64 = base64Doc;
    doc.name = 'TestFile.pdf';
    doc.documentId = '1';

    const docs = [];
    docs.push(doc);
    envDef.documents = docs;

    // Add a recipient to sign the document
    const signer = new docusign.Signer();
    signer.email = "amit.lzkpa@gmail.com";
    signer.name = 'Amit N';
    signer.recipientId = '1';

    // create a signHere tab somewhere on the document for the signer to sign
    // default unit of measurement is pixels, can be mms, cms, inches also
    const signHere = new docusign.SignHere();
    signHere.documentId = '1';
    signHere.pageNumber = '1';
    signHere.recipientId = '1';
    signHere.xPosition = '100';
    signHere.yPosition = '100';

    // can have multiple tabs, so need to add to envelope as a single element list
    const signHereTabs = [];
    signHereTabs.push(signHere);
    const tabs = new docusign.Tabs();
    tabs.signHereTabs = signHereTabs;
    signer.tabs = tabs;

    // Above causes issue
    envDef.recipients = new docusign.Recipients();
    envDef.recipients.signers = [];
    envDef.recipients.signers.push(signer);

    // send the envelope (otherwise it will be "created" in the Draft folder
    envDef.status = 'sent';

    const envelopeSummary = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envDef });
    return JSON.stringify(envelopeSummary);
  },
});

export const testAction_saveAndAnalyseUploadedFile = action({
  args: {
    storedFileId: v.string(),
    projectId: v.id("vsProjects")
  },
  handler: async (ctx, { storedFileId, projectId }) => {
    const newUploadedFile: any = await ctx.runMutation(internal.dbOps.createFile_ProjectSrcDoc, { storedFileId, projectId });
    const p = await ctx.runAction(api.vsActions.analyseUploadedFile, { storedFileId, projectId });
    console.log(p);
    return newUploadedFile;
  }
});

export const testAction_analyseUploadedFile = action({
  args: {
    storedFileId: v.string(),
    projectId: v.id("vsProjects")
  },
  handler: async (ctx, { storedFileId, projectId }) => {
    const storageId = storedFileId as Id<"_storage">;
    const fileUrl = await ctx.storage.getUrl(storageId);

    const GEMINI_API_KEY = "AIzaSyCRnimTZQK20xAebLjS96efb4uDIwbtl4Y";
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Explain how AI works";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    const strings = "TODO: analyse pdf";
    return strings;
  }
});