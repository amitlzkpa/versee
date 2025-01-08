import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const generateViewUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler:
    async (ctx, { storageId }) => {
      return await ctx.storage.getUrl(storageId)
    }
});
