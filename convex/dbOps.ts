import {
  query,
  mutation,
  internalQuery,
  internalMutation
} from "./_generated/server";
import { v } from "convex/values";

export const getDocusignData = internalQuery({
  handler: async (ctx) => {
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return [];
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
    const upsertData = { ...docusignData, user: currUser };
    const newRecord = await ctx.db.insert("docusignDataForUser", upsertData);
    return newRecord;
  },
});

export const getVsMsgsForUser = query({
  handler: async (ctx) => {
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return [];
    const vsMsgs = await ctx.db
      .query("vsMsgs")
      .filter((q) => q.eq(q.field("creator.subject"), currUser.subject))
      .order("desc")
      .collect();
    return vsMsgs;
  },
});

export const createVsMsg = mutation({
  args: {
    newVsMsgContent: v.string(),
  },
  handler: async (ctx, { newVsMsgContent }) => {
    const currUser = await ctx.auth.getUserIdentity();
    const createData = { creator: currUser, msgContent: newVsMsgContent };
    const createdVsMsg = await ctx.db.insert("vsMsgs", createData);
    return createdVsMsg;
  },
});

export const deleteMsgs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const currUser = await ctx.auth.getUserIdentity();
    if (!currUser) return [];

    const vsMsgs = await ctx.db
      .query("vsMsgs")
      .filter((q) => q.eq(q.field("creator.subject"), currUser.subject))
      .order("desc")
      .collect();

    const vsMsgIds = vsMsgs.map(m => m._id);
    const deletePromises = vsMsgIds.map(msgId => new Promise((resolve, reject) => {
      ctx.db.delete(msgId).then(resolve).catch(reject);
    }));
    await (Promise.allSettled(deletePromises));

    return vsMsgIds;
  },
});