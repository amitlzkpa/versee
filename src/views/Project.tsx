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

  const performAction_analyseSrcDoc = useAction(api.vsActions.analyseSrcDoc);

  const performAction_sendDocusignSigningEmail = useAction(api.vsActions.sendDocusignSigningEmail);

  const curProjectSrcDocs = useQuery(api.dbOps.getAllSrcDocs_ForProject, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" gap="sm">

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

        {/* UPLOAD FILE */}

        <Divider w="100%" my="lg" />

        <Flex direction="column">
          <Text size="md" fw="bold">
            Project Files
          </Text>
        </Flex>

        <FileUploader projectId={currProject._id} />

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
      </Flex>
    </Flex>
  );
}
