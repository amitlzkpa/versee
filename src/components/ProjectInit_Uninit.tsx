import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Text,
  rem
} from '@mantine/core';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

import FileUploader from '../components/FileUploader';

import useCvxUtils from '../hooks/cvxUtils';

export default function ProjectInit_Uninit({
  projectId = null
}: any) {

  const cvxUtils = useCvxUtils();

  const curProjectSrcDocs = useQuery(api.dbOps.getAllSrcDocs_ForProject, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  const performAction_createNewSrcDoc = useAction(api.vsActions.createNewSrcDoc);

  const performAction_analyseSrcDoc = useAction(api.vsActions.analyseSrcDoc);

  const onClick_uploadFiles_SrcDoc = async (droppedFiles: any) => {
    const ps = droppedFiles.map((file: any) => new Promise((resolve, reject) => {
      cvxUtils.performAction_generateUploadUrl()
        .then(async (uploadUrl) => {
          try {
            const result = await fetch(uploadUrl, {
              method: "POST",
              body: file,
            });
            const uploadedCvxFile = await result.json();
            const cvxStoredFileId = uploadedCvxFile.storageId;
            const newSrcDocId = await performAction_createNewSrcDoc({
              projectId, cvxStoredFileId
            })
            return resolve(newSrcDocId);
          } catch (err) {
            return reject(err);
          }
        });
    }));

    const srcDocIds = (await Promise.allSettled(ps)).filter(r => r.status === "fulfilled").map(r => r.value);

    const updateData = JSON.stringify({ initializationStatus: "agreements_uploaded" });

    await cvxUtils.performAction_updateProject({ projectId, updateData })
  };


  return (
    <>
      <Flex
        w="100%"
        h="100%"
        direction="column"
        align="center"
        gap="sm"
      >
        {/* Info message */}
        <Flex
          w="100%"
          h="100%"
          maw="400"
          direction="column"
          justify="center"
          align="center"
          gap="sm"
          style={{ textAlign: "center" }}
        >
          <Text>
            Time to get the ball rolling!
          </Text>
          <Text fz="lg">
            Upload your agreement and let’s get things moving.
          </Text>
        </Flex>

        {/* File Upload */}
        <Flex
          w="100%"
          h="100%"
          direction="column"
          justify="center"
          align="center"
          gap="sm"
          style={{ textAlign: "center" }}
        >
          <FileUploader
            projectId={projectId}
            onClick_uploadFiles={onClick_uploadFiles_SrcDoc}
          />
        </Flex>
      </Flex>
    </>
  );
};