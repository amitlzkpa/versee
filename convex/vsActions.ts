// @ts-nocheck
"use node";
import * as https from "https";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as docusign from "docusign-esign";

// UTILS

export const generateUploadUrl = action(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// PROJECT

export const createNewProject = action({
  handler: async (ctx) => {
    const newProject: any = await ctx.runMutation(internal.dbOps.createNewProject);
    return newProject;
  }
});

// DOCUSIGN

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

async function getAccessToken(ctx, storedDocusignData) {
  let userTokenObj = storedDocusignData.userTokenObj;
  const issuedAt = userTokenObj.issuedAt;
  const tokenDurationInSecs = parseInt(userTokenObj.expires_in);
  const expirtyTs = new Date(new Date(issuedAt).getTime() + (tokenDurationInSecs - (10 * 60)) * 1000);
  const tokenNeedsRefresh = new Date(expirtyTs).getTime() < new Date().getTime();
  if (tokenNeedsRefresh) {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const apiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + userTokenObj.access_token);

    const scopes = [
      oAuth.Scope.IMPERSONATION,
      oAuth.Scope.SIGNATURE
    ];
    const userId = storedDocusignData.userInfo.sub;
    const expiresIn = 60 * 60;

    const res = await apiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      userId,
      scopes,
      Buffer.from(process.env.DOCUSIGN_RSA_PRV_KEY.replace(/\\n/g, '\n')),
      expiresIn
    );

    userTokenObj = res.body;
    userTokenObj.issuedAt = new Date().toISOString();

    const userInfo = await apiClient.getUserInfo(userTokenObj.access_token);
    const docusignDataStr = JSON.stringify({ userTokenObj, userInfo });
    const storedData: any = await ctx.runMutation(internal.dbOps.upsertDocusignData_ForUser, { docusignDataStr });
  }
  return userTokenObj;
}

export const startDocusignOAuth = action({
  handler: async (ctx) => {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const apiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const scopes = [
      oAuth.Scope.IMPERSONATION,
      oAuth.Scope.SIGNATURE
    ];

    const oauthLoginUrl = apiClient.getAuthorizationUri(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      scopes,
      process.env.DOCUSIGN_REDIRECT_URI,
      // "http://localhost:5173/callback/docusign",
      "code"
    );
    return oauthLoginUrl;
  }
});

export const retrieveDocusignAccessToken = action({
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

    const code = authCode;
    const accessTokenObj = await apiClient.generateAccessToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      process.env.DOCUSIGN_CLIENT_SECRET,
      code
    );
    accessTokenObj.issuedAt = new Date().toISOString();
    const userInfo = await apiClient.getUserInfo(accessTokenObj.accessToken);
    const docusignDataStr = JSON.stringify({ accessTokenObj, userInfo });
    const storedData: any = await ctx.runMutation(internal.dbOps.upsertDocusignData_ForUser, { docusignDataStr });
    return storedData;
  }
});

export const retrieveDocusignUserToken = action({
  handler: async (ctx) => {
    const storedDocusignData = await ctx.runQuery(api.dbOps.getDocusignData_ForCurrUser);

    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const apiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const scopes = [
      oAuth.Scope.IMPERSONATION,
      oAuth.Scope.SIGNATURE
    ];
    const userId = storedDocusignData.userInfo.sub;
    const expiresIn = 3600;

    const res = await apiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      userId,
      scopes,
      Buffer.from(process.env.DOCUSIGN_RSA_PRV_KEY.replace(/\\n/g, '\n')),
      expiresIn
    );

    const userTokenObj = res.body;
    userTokenObj.issuedAt = new Date().toISOString();
    const userInfo = await apiClient.getUserInfo(userTokenObj.access_token);

    const docusignDataStr = JSON.stringify({ userTokenObj, userInfo });
    const storedData: any = await ctx.runMutation(internal.dbOps.upsertDocusignData_ForUser, { docusignDataStr });
    return storedData;
  }
});

export const sendDocusignSigningEmail = action({
  args: {
    srcDocId: v.id("vsSrcDoc")
  },
  handler: async (ctx, { srcDocId }) => {
    const restApi = docusign.ApiClient.RestApi;
    const oAuth = docusign.ApiClient.OAuth;
    const basePath = restApi.BasePath.DEMO;
    const oAuthBasePath = oAuth.BasePath.DEMO;
    const dsApiClient = new docusign.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
    });

    const storedDocusignData = await ctx.runQuery(api.dbOps.getDocusignData_ForCurrUser);
    const accountId = storedDocusignData.userInfo.accounts[0].accountId;

    const userTokenObj = await getAccessToken(ctx, storedDocusignData);
    const accessToken = userTokenObj.access_token;

    const srcDoc = await ctx.runQuery(internal.dbOps.getSrcDoc_BySrcDocId, {
      srcDocId
    });
    const fileUrl = await ctx.storage.getUrl(srcDoc.cvxStoredFileId);
    const docBytes = await downloadFileAsBytes(fileUrl);
    const doc3b64 = Buffer.from(docBytes).toString('base64');

    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = `Please Sign: ${srcDoc.titleText}`;
    envDef.emailBlurb = srcDoc.summaryText;

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

// SRCDOCS

const generateForPDF_title = async (pdfArrayBuffer, model) => {
  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(pdfArrayBuffer).toString("base64"),
        mimeType: "application/pdf",
      },
    },
    "Give a short title for this document. Keep it simple and don't use any formatting. Reply directly with one single suitable title.",
  ]);
  const titleText = result.response.text();
  return titleText;
};

const generateForPDF_summary = async (pdfArrayBuffer, model) => {
  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(pdfArrayBuffer).toString("base64"),
        mimeType: "application/pdf",
      },
    },
    "Give a very short outline of the contents of this document in 2-3 sentences.",
  ]);
  const summaryText = result.response.text();
  return summaryText;
};

export const createNewSrcDoc = action({
  args: {
    cvxStoredFileId: v.string(),
    projectId: v.string()
  },
  handler: async (ctx, { cvxStoredFileId, projectId }) => {
    const _cvxStoredFileId = cvxStoredFileId as Id<"_storage">;
    const _projectId = projectId as Id<"vsProjects">;
    const writeData = {
      cvxStoredFileId: _cvxStoredFileId,
      projectId: _projectId
    };
    const newSrcDocId: any = await ctx.runMutation(internal.dbOps.createNewSrcDoc, writeData);
    ctx.runAction(api.vsActions.analyseSrcDoc, { srcDocId: newSrcDocId });
    return newSrcDocId;
  }
});

export const analyseSrcDoc = action({
  args: {
    srcDocId: v.id("vsSrcDoc")
  },
  handler: async (ctx, { srcDocId }) => {
    const srcDoc = await ctx.runQuery(internal.dbOps.getSrcDoc_BySrcDocId, {
      srcDocId
    });
    const fileUrl = await ctx.storage.getUrl(srcDoc.cvxStoredFileId);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const pdfArrayBuffer = await fetch(fileUrl).then((response) => response.arrayBuffer());

    let uploadedFileData;

    const writeData = { titleStatus: "generating" };
    uploadedFileData = await ctx.runMutation(internal.dbOps.updateSrcDoc, {
      srcDocId,
      updateDataStr: JSON.stringify(writeData)
    });
    const titleText = await generateForPDF_title(pdfArrayBuffer, model);
    writeData.titleStatus = "generated";
    writeData.titleText = titleText;
    uploadedFileData = await ctx.runMutation(internal.dbOps.updateSrcDoc, {
      srcDocId,
      updateDataStr: JSON.stringify(writeData)
    });

    writeData.summaryStatus = "generating";
    uploadedFileData = await ctx.runMutation(internal.dbOps.updateSrcDoc, {
      srcDocId,
      updateDataStr: JSON.stringify(writeData)
    });
    const summaryText = await generateForPDF_summary(pdfArrayBuffer, model);
    writeData.summaryStatus = "generated";
    writeData.summaryText = summaryText;
    uploadedFileData = await ctx.runMutation(internal.dbOps.updateSrcDoc, {
      srcDocId,
      updateDataStr: JSON.stringify(writeData)
    });
  }
});