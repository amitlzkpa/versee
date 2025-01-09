import { useState } from 'react';
import { Button, Divider, Flex, Loader, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

import { FaMinusCircle, FaPhotoVideo, FaUpload } from 'react-icons/fa';

import { Authenticated, Unauthenticated, AuthLoading, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  const [isUploading, setIsUploading] = useState(false);

  const performAction_generateUploadUrl = useAction(api.uploadedFiles.generateUploadUrl);

  const handleDrop = async (files: any) => {

    setIsUploading(true);

    const ps = files.map((file: any) => new Promise((resolve, reject) => {
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
  }

  const performAction_testAction_startDocusignOAuth = useAction(api.vsActions.testAction_startDocusignOAuth);

  const onClickTest_startDocusignOAuth = async () => {
    const redirectUri = await performAction_testAction_startDocusignOAuth();
    window.location.href = redirectUri;
  };

  const performAction_testAction_sendSigningEmail = useAction(api.vsActions.testAction_sendSigningEmail);

  const onClickTest_sendSigningEmail = async () => {
    console.log("Sending signing email...");
    const res = await performAction_testAction_sendSigningEmail();
    const sentEnvelopSummary = JSON.parse(res);
    console.log(sentEnvelopSummary);
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
          <Button
            onClick={onClickTest_startDocusignOAuth}
            w="100%"
            size="lg"
          >
            Start Docusign OAuth
          </Button>
          <Button
            onClick={onClickTest_sendSigningEmail}
            w="100%"
            size="lg"
          >
            Send Signing Email
          </Button>

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
        </Flex>
      </Authenticated>
    </Flex>
  );
}
