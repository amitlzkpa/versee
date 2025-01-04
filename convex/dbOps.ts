import {
  query,
  mutation
} from "./_generated/server";
import { v } from "convex/values";

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