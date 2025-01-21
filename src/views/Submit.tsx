import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Divider, Flex, Text, rem } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { FaExclamationCircle } from "react-icons/fa";
import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

export default function Submit() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);
  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const [currUserHasAccess, setCurrUserHasAccess] = useState(true);

  useEffect(() => {
    const currUserEmail = storedUserData?.user?.email;
    if (!currUserEmail) return;
    const signerEmails = (currProject?.signers ?? []).map(
      (s: any) => s.signerEmail
    );
    setCurrUserHasAccess(signerEmails.includes(currUserEmail));
  }, [currProject, storedUserData?.user?.email]);

  // PRJFILE

  const curProjectPrjFiles = useQuery(
    api.dbOps.getAllPrjFiles_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const onClick_uploadFiles_PrjFiles = async (droppedFiles: any) => {
    const ps = droppedFiles.map(
      (file: any) =>
        new Promise((resolve, reject) => {
          cvxUtils.performAction_generateUploadUrl().then(async (uploadUrl) => {
            try {
              const result = await fetch(uploadUrl, {
                method: "POST",
                body: file,
              });
              const uploadedCvxFile = await result.json();
              const cvxStoredFileId = uploadedCvxFile.storageId;
              const newPrjFileId =
                await cvxUtils.performAction_createNewPrjFile({
                  projectId: currProject?._id,
                  cvxStoredFileId,
                });
              return resolve(newPrjFileId);
            } catch (err) {
              return reject(err);
            }
          });
        })
    );

    const newPrjFileIds = (await Promise.allSettled(ps))
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        <Text>Submit</Text>
        <Text fz="lg">Use this page to submit files.</Text>
      </Flex>

      <Divider w="60%" my="lg" />

      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        {currUserHasAccess ? (
          <>
            <FileUploader
              projectId={currProject?._id}
              onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
            />
          </>
        ) : (
          <>
            <Flex justify="center" align="center" gap="sm">
              <FaExclamationCircle
                style={{
                  width: rem(12),
                  height: rem(12),
                  color: "var(--mantine-color-gray-5)",
                }}
              />
              <Text>You do not have access.</Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
