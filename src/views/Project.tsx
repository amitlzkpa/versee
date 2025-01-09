import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Divider, Flex, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

import { FaMinusCircle, FaPaperclip, FaTrash, FaUpload } from 'react-icons/fa';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Project() {
  // PROJECT
  const { projectId } = useParams();

  const currProject = useQuery(api.dbOps.getProject, projectId ? { projectId } : "skip");

  // FILE UPLOAD

  const [droppedFiles, setDroppedFiles] = useState<any[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const performAction_generateUploadUrl = useAction(api.uploadedFiles.generateUploadUrl);

  const openRef = useRef<() => void>(null);

  const addToDroppedFiles = (files: any) => {
    setDroppedFiles(prev => [...prev, ...files]);
  };

  const removeFromDroppedFiles = (file: any) => {
    setDroppedFiles(droppedFiles.filter((f) => f !== file));
  };

  const onClick_uploadFiles = async () => {

    setIsUploading(true);

    const ps = droppedFiles.map((file: any) => new Promise((resolve, reject) => {
      performAction_generateUploadUrl()
        .then(async (uploadUrl) => {
          const result = await fetch(uploadUrl, {
            method: "POST",
            body: file,
          });
          const { storageId } = await result.json();
          return resolve(storageId);
        });
    }));

    const uploadIds = (await Promise.allSettled(ps)).filter(r => r.status === "fulfilled").map(r => r.value);
    console.log(uploadIds);
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
              <FaUpload
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
                        <FaPaperclip
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
          onClick={onClick_uploadFiles}
          w="100%"
          size="lg"
          disabled={droppedFiles.length < 1}
        >
          Upload Files
        </Button>
      </Flex>
    </Flex>
  );
}
