"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const testAction = action({
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
