import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Card, Divider, Flex, Text, UnstyledButton, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

import { FaFileDownload, FaFileImport, FaMinusCircle, FaTrash } from 'react-icons/fa';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Project() {
  // PROJECT
  const { projectId } = useParams();

  const currProject = useQuery(api.dbOps.getProject_ByProjectId, projectId ? { projectId } : "skip");

  // FILE UPLOAD

  const [droppedFiles, setDroppedFiles] = useState<any[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const performAction_createUploadedSrcDoc = useAction(api.vsActions.testAction_createUploadedSrcDoc);

  const performAction_analyseUploadedSrcDoc = useAction(api.vsActions.testAction_analyseUploadedSrcDoc);

  const performAction_generateUploadUrl = useAction(api.uploadedFiles.generateUploadUrl);

  const curProjectSrcDocs = useQuery(api.dbOps.getAllSrcDocs_ForProject, projectId ? { projectId } : "skip");

  const openRef = useRef<() => void>(null);

  const addToDroppedFiles = (files: any) => {
    setDroppedFiles(prev => [...prev, ...files]);
  };

  const removeFromDroppedFiles = (file: any) => {
    setDroppedFiles(droppedFiles.filter((f) => f !== file));
  };

  const onClick_uploadDroppedFilesToSrcDocs = async () => {
    setIsUploading(true);

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
            const newSrcDocId = await performAction_createUploadedSrcDoc({ projectId: currProject._id, cvxStoredFileId })
            return resolve(newSrcDocId);
          } catch (err) {
            return reject(err);
          }
        });
    }));

    const srcDocIds = (await Promise.allSettled(ps)).filter(r => r.status === "fulfilled").map(r => r.value);
    setDroppedFiles([]);
    setIsUploading(false);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" gap="sm">

        <Flex direction="column">
          <Text size="sm">
            ProjectId: {currProject?._id}
          </Text>
          <Text size="lg" fw="bold">
            Creator: {currProject?.user.name}
          </Text>
        </Flex>

        <Divider w="100%" />

        <Dropzone
          openRef={openRef}
          activateOnClick={false}
          loading={isUploading}
          onDrop={addToDroppedFiles}
          accept={[
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/heic',
            'text/csv',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "all",
              cursor: "pointer"
            }}
            onClick={() => { openRef.current?.() }}
          />
          <Flex
            h="180"
            direction="column"
            justify="center"
            align="center"
            gap="md"
            p="sm"
            style={{ pointerEvents: 'none', position: "relative" }}
          >
            <Dropzone.Accept>
              <FaFileDownload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <FaMinusCircle
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Flex w="100%" h="100%">
                {
                  droppedFiles.length > 0
                    ?
                    (
                      <Flex w="100%" direction="column" align="center" gap="sm">
                        <Text fz="md" fw="bold">Selected Files</Text>
                        <Flex w="100%" direction="column" gap="xs" style={{ overflowY: "auto", pointerEvents: "auto" }}>
                          {droppedFiles.map((f, i) =>
                          (
                            <Flex key={`${f.name}_${i}`} gap="xs" align="center">
                              <FaTrash
                                style={{
                                  pointerEvents: 'all',
                                  width: rem(12),
                                  height: rem(12),
                                  color: 'var(--mantine-color-gray-5)',
                                  cursor: "pointer"
                                }}
                                onClick={() => { removeFromDroppedFiles(f) }}
                              />
                              <Text fz="sm" c="dimmed">{i + 1}.</Text>
                              <Text>{f.name}</Text>
                            </Flex>
                          )
                          )}
                        </Flex>
                      </Flex>
                    )
                    :
                    (
                      <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        gap="sm"
                        style={{ textAlign: "center" }}
                      >
                        <FaFileImport
                          style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        />
                        <Text size="xl" inline>
                          Drag images here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline>
                          Attach as many files as you like
                        </Text>
                      </Flex>
                    )
                }
              </Flex>
            </Dropzone.Idle>
          </Flex>
        </Dropzone>

        <Button
          onClick={onClick_uploadDroppedFilesToSrcDocs}
          w="100%"
          size="lg"
          disabled={droppedFiles.length < 1}
        >
          Upload Files
        </Button>

        <Divider w="100%" />

        <Flex w="100%" direction="column" align="center" gap="xs">
          <Text fz="md" fw="bold">Project Files</Text>
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
                        href={srcDoc.fileUrl}
                        target="_blank"
                        w="100%"
                        size="lg"
                      >
                        Open
                      </Button>
                      <Button
                        onClick={() => {
                          performAction_analyseUploadedSrcDoc({
                            srcDocId: srcDoc._id
                          });
                        }}
                        w="100%"
                        size="lg"
                      >
                        Analyse
                      </Button>
                    </Flex>
                  </Card>
                );
              })
          }
        </Flex>
      </Flex>
    </Flex>
  );
}
