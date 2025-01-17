
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

export default function useCvxUtils() {
  const performAction_generateUploadUrl = useAction(api.vsActions.generateUploadUrl);

  const performAction_sendDocusignSigningEmail = useAction(api.vsActions.sendDocusignSigningEmail);

  const performAction_updateProject = useAction(api.vsActions.updateProject);

  return {
    performAction_generateUploadUrl,
    performAction_sendDocusignSigningEmail,
    performAction_updateProject
  };
}