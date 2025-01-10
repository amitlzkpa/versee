import {
  query,
  internalQuery,
  internalMutation,
  mutation
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

export const createFile_ProjectSrcDoc = mutation({
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
