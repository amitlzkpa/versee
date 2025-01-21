import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function useCvxUtils() {
  const performAction_generateUploadUrl = useAction(
    api.vsActions.generateUploadUrl
  );

  const performAction_sendDocusignSigningEmail = useAction(
    api.vsActions.sendDocusignSigningEmail
  );

  const performAction_createNewProject = useAction(
    api.vsActions.createNewProject
  );

  const performAction_updateProject = useAction(api.vsActions.updateProject);

  const performAction_createSenderViewFromDoc = useAction(
    api.vsActions.createSenderViewFromDoc
  );

  const performAction_sendDocusignEnvelope = useAction(
    api.vsActions.sendDocusignEnvelope
  );

  const performAction_createNewSrcDoc = useAction(
    api.vsActions.createNewSrcDoc
  );

  const performAction_createNewPrjFile = useAction(
    api.vsActions.createNewPrjFile
  );

  return {
    performAction_generateUploadUrl,
    performAction_sendDocusignSigningEmail,
    performAction_createNewProject,
    performAction_updateProject,
    performAction_createSenderViewFromDoc,
    performAction_sendDocusignEnvelope,
    performAction_createNewSrcDoc,
    performAction_createNewPrjFile,
  };
}
