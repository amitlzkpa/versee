import { mutation, query } from "./_generated/server";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = action(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const generateViewUrl = action({
  args: { storageId: v.id("_storage") },
  handler:
    async (ctx, { storageId }) => {
      return await ctx.storage.getUrl(storageId);
    }
});
