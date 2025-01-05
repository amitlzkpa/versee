"use node";
import { action } from "./_generated/server";
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
