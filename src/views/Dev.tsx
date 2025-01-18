// @ts-nocheck
import { Button, Divider, Flex, Loader, Text } from "@mantine/core";

import FileUploader from "../components/FileUploader";

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useAction,
  useQuery,
} from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export default function Dev() {
  // const projectId = "jd7cj5q3yk8zt1kpjtz54h7zt5786v79";
  const projectId = "jd77gfkk4k57yb70vcxn92d10178hv8b";

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  // SRCDOC

  const performAction_generateUploadUrl = useAction(
    api.vsActions.generateUploadUrl
  );

  const performAction_createNewSrcDoc = useAction(
    api.vsActions.createNewSrcDoc
  );

  const onClick_uploadFiles_SrcDoc = async (droppedFiles: any) => {
    const ps = droppedFiles.map(
      (file: any) =>
        new Promise((resolve, reject) => {
          performAction_generateUploadUrl().then(async (uploadUrl) => {
            try {
              const result = await fetch(uploadUrl, {
                method: "POST",
                body: file,
              });
              const uploadedCvxFile = await result.json();
              const cvxStoredFileId = uploadedCvxFile.storageId;
              const newSrcDocId = await performAction_createNewSrcDoc({
                projectId: currProject?._id,
                cvxStoredFileId,
              });
              return resolve(newSrcDocId);
            } catch (err) {
              return reject(err);
            }
          });
        })
    );

    const srcDocIds = (await Promise.allSettled(ps))
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  };

  // SENDER VIEW

  const performAction_openDocusignSenderView = useAction(
    api.vsActions.openDocusignSenderView
  );

  const onClick_openSenderView = async () => {
    const viewRequestUrl = await performAction_openDocusignSenderView({
      srcDocId: curProjectSrcDocs![0]!._id,
      returnUrl: `${window.location.origin}/completed-sending`,
    });

    const taggingIframe = document.getElementById("tagging-iframe-target");
    taggingIframe!.setAttribute("src", viewRequestUrl!);
    taggingIframe!.style.visibility = "visible";
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <AuthLoading>
        <Loader size="md" />
      </AuthLoading>
      <Unauthenticated>
        <Flex justify="center" p="lg">
          Please login
        </Flex>
      </Unauthenticated>
      <Authenticated>
        <Flex w="60%" direction="column" align="center" gap="md" p="lg">
          {(curProjectSrcDocs ?? []).length < 1 ? (
            <>
              <FileUploader
                projectId={currProject?._id}
                onClick_uploadFiles={onClick_uploadFiles_SrcDoc}
                allowMultiple={false}
              />
            </>
          ) : (
            <>
              <Flex
                w="100%"
                h="100%"
                direction="column"
                align="center"
                gap="sm"
              >
                <Text>{curProjectSrcDocs![0]!._id}</Text>
                <Text size="xl" fw="bold">
                  {curProjectSrcDocs![0]!.titleText}
                </Text>
                <embed
                  style={{ width: "100%", height: "100%", minHeight: "400px" }}
                  src={curProjectSrcDocs![0]!.fileUrl}
                />
                <Button
                  variant="outline"
                  onClick={onClick_openSenderView}
                  size="lg"
                >
                  Configure
                </Button>
                <iframe
                  style={{
                    width: "100%",
                    minHeight: 400,
                    height: "100%",
                    visibility: "hidden",
                  }}
                  src=""
                  id="tagging-iframe-target"
                />
              </Flex>
            </>
          )}
        </Flex>
      </Authenticated>
    </Flex>
  );
}
