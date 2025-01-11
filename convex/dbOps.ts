import {
  query,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const getDocusignData = internalQuery({
  handler: async (ctx) => {
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return null;
    const docusignData = await ctx.db
      .query("docusignDataForUser")
      .filter((q) => q.eq(q.field("user.subject"), currUser.subject))
      .first();
    return docusignData;
  },
});

export const upsertDocusignDataForUser = internalMutation({
  args: {
    docusignDataStr: v.string(),
  },
  handler: async (ctx, { docusignDataStr }) => {
    const docusignData = JSON.parse(docusignDataStr);
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return null;
    const upsertData = { ...docusignData, user: currUser };
    const exData = await ctx.db
      .query("docusignDataForUser")
      .filter((q) => q.eq(q.field("user.subject"), currUser.subject))
      .first();
    let retVal;
    if (exData) {
      await ctx.db.patch(exData._id, upsertData);
      retVal = exData._id;
    } else {
      const newRecord = await ctx.db.insert("docusignDataForUser", upsertData);
      retVal = newRecord;
    }
    return retVal;
  },
});

// PROJECT

export const getAllProjectsForCurrUser = query(
  {
    handler: async (ctx) => {
      const currUser = await ctx.auth.getUserIdentity();
      if (!currUser) return [];
      const projects = await ctx.db
        .query("vsProjects")
        .filter((q) => q.eq(q.field("user.subject"), currUser.subject))
        .order("desc")
        .collect();
      return projects;
    }
  }
);

export const getProject = query(
  {
    args: { projectId: v.optional(v.string()) },
    handler: async (ctx, { projectId }) => {
      if (!projectId) return null;
      const dbId = projectId as Id<"vsProjects">;
      const project = await ctx.db.get(dbId);
      return project;
    }
  }
);

export const createNewProject = internalMutation({
  handler: async (ctx) => {
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return null;
    const newProjectData = { user: currUser };
    const newProject = await ctx.db.insert("vsProjects", newProjectData);
    return newProject;
  },
});

// FILE

export const getFiles_ProjectSrcDocs = query(
  {
    args: { projectId: v.optional(v.string()) },
    handler: async (ctx, { projectId }) => {
      if (!projectId) return [];
      const dbRecs = await ctx.db
        .query("vsFile")
        .filter((q) => q.and(q.eq(q.field("projectId"), projectId), q.eq(q.field("type"), "srcdoc")))
        .order("desc")
        .collect();
      const ps = dbRecs.map((dbRec) => new Promise((resolve, reject) => {
        const storageId = dbRec.storedFileId as Id<"_storage">;
        ctx.storage.getUrl(storageId)
          .then((fileUrl) => {
            resolve({
              ...dbRec,
              fileUrl
            });
          })
          .catch((err) => {
            reject(err);
          });
      }));
      const projectSrcDocs = (await Promise.allSettled(ps)).filter(p => p.status === "fulfilled").map(p => p.value);
      return projectSrcDocs;
    }
  }
);

export const createFile_ProjectSrcDoc = internalMutation({
  args: {
    storedFileId: v.string(),
    projectId: v.id("vsProjects")
  },
  handler: async (ctx, { storedFileId, projectId }) => {
    const uploadedFileData = { storedFileId, projectId, type: "srcdoc" };
    const newUploadedFile = await ctx.db.insert("vsFile", uploadedFileData);
    return newUploadedFile;
  }
});

export const updateFile_ProjectSrcDoc = internalMutation({
  args: {
    uploadedFileId: v.id("vsFile"),
    updateDataStr: v.string()
  },
  handler: async (ctx, { uploadedFileId, updateDataStr }) => {
    const writeData = JSON.parse(updateDataStr);
    const updatedFileData = await ctx.db.patch(uploadedFileId, writeData);
    return updatedFileData;
  }
});
