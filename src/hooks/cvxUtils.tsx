
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

export default function useCvxUtils() {
  const performAction_generateUploadUrl = useAction(api.vsActions.generateUploadUrl);

  return {
    performAction_generateUploadUrl
  };
}