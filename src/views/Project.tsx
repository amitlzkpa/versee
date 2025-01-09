import { useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Divider, Flex, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

import { FaMinusCircle, FaPhotoVideo, FaUpload } from 'react-icons/fa';

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

  const handleDrop = async (files: any) => {
    setDroppedFiles(prev => [...prev, ...files]);
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

        <Dropzone loading={isUploading} onDrop={handleDrop}>
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap="md"
            p="xl"
            style={{ pointerEvents: 'none' }}
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
              <FaPhotoVideo
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              />
            </Dropzone.Idle>

            <Flex
              direction="column"
              justify="center"
              align="center"
              gap="sm"
              style={{ textAlign: "center" }}
            >
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline>
                Attach as many files as you like
              </Text>
            </Flex>
          </Flex>
        </Dropzone>

        <Button
          onClick={onClick_uploadFiles}
          w="100%"
          size="lg"
        >
          Upload Files
        </Button>
      </Flex>
    </Flex>
  );
}
