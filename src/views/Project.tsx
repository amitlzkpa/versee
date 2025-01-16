import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Card, Divider, Flex, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

import { FaFileDownload, FaFileImport, FaMinusCircle, FaTrash } from 'react-icons/fa';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';
import FileUploader from '../components/FileUploader';

export default function Project() {
  // PROJECT
  const { projectId } = useParams();

  const currProject = useQuery(api.dbOps.getProject_ByProjectId, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  // FILE UPLOAD

  const performAction_generateUploadUrl = useAction(api.vsActions.generateUploadUrl);

  const performAction_sendDocusignSigningEmail = useAction(api.vsActions.sendDocusignSigningEmail);

  // SRCDOC

  const curProjectSrcDocs = useQuery(api.dbOps.getAllSrcDocs_ForProject, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  const performAction_createNewSrcDoc = useAction(api.vsActions.createNewSrcDoc);

  const performAction_analyseSrcDoc = useAction(api.vsActions.analyseSrcDoc);

  const onClick_uploadFiles_SrcDoc = async (droppedFiles: any) => {
    const ps = droppedFiles.map((file: any) => new Promise((resolve, reject) => {
      performAction_generateUploadUrl()
        .then(async (uploadUrl) => {
          try {
            const result = await fetch(uploadUrl, {
              method: "POST",
              body: file,
            });
            const uploadedCvxFile = await result.json();
            const cvxStoredFileId = uploadedCvxFile.storageId;
            const newSrcDocId = await performAction_createNewSrcDoc({
              projectId: currProject?._id, cvxStoredFileId
            })
            return resolve(newSrcDocId);
          } catch (err) {
            return reject(err);
          }
        });
    }));

    const srcDocIds = (await Promise.allSettled(ps)).filter(r => r.status === "fulfilled").map(r => r.value);
  };

  // PRJFILE

  const performAction_createNewPrjFile = useAction(api.vsActions.createNewPrjFile);

  const onClick_uploadFiles_PrjFiles = async (droppedFiles: any) => {
    const ps = droppedFiles.map((file: any) => new Promise((resolve, reject) => {
      performAction_generateUploadUrl()
        .then(async (uploadUrl) => {
          try {
            const result = await fetch(uploadUrl, {
              method: "POST",
              body: file,
            });
            const uploadedCvxFile = await result.json();
            const cvxStoredFileId = uploadedCvxFile.storageId;
            const newPrjFileId = await performAction_createNewPrjFile({
              projectId: currProject?._id, cvxStoredFileId
            })
            return resolve(newPrjFileId);
          } catch (err) {
            return reject(err);
          }
        });
    }));

    const newPrjFileIds = (await Promise.allSettled(ps)).filter(r => r.status === "fulfilled").map(r => r.value);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" gap="sm" my="lg">

        <Flex direction="column">
          <Text size="sm">
            ProjectId: {currProject?._id}
          </Text>
          <Text size="lg" fw="bold">
            Creator: {currProject?.creator.name}
          </Text>
        </Flex>

        <Divider w="100%" my="lg" />

        <Flex direction="column">
          <Text size="md" fw="bold">
            Agreement Data
          </Text>
        </Flex>

        <FileUploader
          projectId={currProject?._id}
          onClick_uploadFiles={onClick_uploadFiles_SrcDoc}
        />

        <Flex w="100%" direction="column" align="center" gap="xs">
          {
            (curProjectSrcDocs ?? [])
              .map((srcDoc: any) => {
                return (
                  <Card
                    key={srcDoc._id}
                    w="100%"
                    withBorder
                    radius="xl"
                  >
                    <Flex direction="column" align="stretch" gap="sm">
                      <Text fz="sm">{srcDoc._id}</Text>
                      <Text fw="bold">{srcDoc.titleText}</Text>
                      <Text>{srcDoc.summaryText}</Text>

                      <Button
                        component="a"
                        variant="outline"
                        href={srcDoc.fileUrl}
                        target="_blank"
                        w="100%"
                        size="lg"
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          performAction_analyseSrcDoc({
                            srcDocId: srcDoc._id
                          });
                        }}
                        w="100%"
                        size="lg"
                      >
                        Analyse
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          performAction_sendDocusignSigningEmail({
                            srcDocId: srcDoc._id
                          });
                        }}
                        w="100%"
                        size="lg"
                      >
                        Send
                      </Button>
                    </Flex>
                  </Card>
                );
              })
          }
        </Flex>

        <Divider w="100%" my="lg" />

        <Flex direction="column">
          <Text size="md" fw="bold">
            Project Files
          </Text>
        </Flex>

        <FileUploader
          projectId={currProject?._id}
          onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
        />
      </Flex>
    </Flex>
  );
}
