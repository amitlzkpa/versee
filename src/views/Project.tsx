import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
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

import ProjectInit_Uninit from '../components/ProjectInit_Uninit';
import ProjectInit_AgreementsUploaded from '../components/ProjectInit_AgreementsUploaded';
import FileUploader from '../components/FileUploader';

import useCvxUtils from '../hooks/cvxUtils';



export default function Project() {

  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(api.dbOps.getProject_ByProjectId, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  // SRCDOC

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

  const curProjectPrjFiles = useQuery(api.dbOps.getAllPrjFiles_ForProject, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  const performAction_createNewPrjFile = useAction(api.vsActions.createNewPrjFile);

  const onClick_uploadFiles_PrjFiles = async (droppedFiles: any) => {
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
    <Flex w="100%" direction="column" gap="sm" p="lg">
      <Flex w="40%" direction="column" gap="sm" my="lg">

        {(() => {
          switch (currProject?.initializationStatus) {
            case "uninitialized":
              return <ProjectInit_Uninit projectId={currProject?._id} />
            case "agreements_uploaded":
              return <ProjectInit_AgreementsUploaded projectId={currProject?._id} />
            default:
              return null
          }
        })()}

        {
          (currProject?.initializationStatus === "uninitialized")
            ?
            <ProjectInit_Uninit projectId={currProject?._id} />
            :
            <>
              <Divider w="100%" />

              <Flex direction="column" my="lg">
                <Text size="sm">
                  ProjectId: {currProject?._id}
                </Text>
                <Text size="lg" fw="bold">
                  Creator: {currProject?.creator.name}
                </Text>
              </Flex>

              <Divider w="100%" />

              <Accordion defaultValue="upload-srcdoc">

                <Accordion.Item key="upload-srcdoc" value="upload-srcdoc">
                  <Accordion.Control>
                    <Text size="md" fw="bold">
                      Upload Associated Agreement
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Flex direction="column">
                      <FileUploader
                        projectId={currProject?._id}
                        onClick_uploadFiles={onClick_uploadFiles_SrcDoc}
                      />
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key="list-srcdocs" value="list-srcdocs">
                  <Accordion.Control>
                    <Text size="md" fw="bold">
                      View Agreements
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
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
                                      cvxUtils.performAction_sendDocusignSigningEmail({
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
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key="upload-prjfile" value="upload-prjfile">
                  <Accordion.Control>
                    <Text size="md" fw="bold">
                      Upload Project Files
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Flex direction="column">
                      <FileUploader
                        projectId={currProject?._id}
                        onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
                      />
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key="list-prjfiles" value="list-prjfiles">
                  <Accordion.Control>
                    <Text size="md" fw="bold">
                      View Project Files
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Flex w="100%" direction="column" align="center" gap="xs">
                      {
                        (curProjectPrjFiles ?? [])
                          .map((prjFile: any) => {
                            return (
                              <Card
                                key={prjFile._id}
                                w="100%"
                                withBorder
                                radius="xl"
                              >
                                <Flex direction="column" align="stretch" gap="sm">
                                  <Text fz="sm">{prjFile._id}</Text>

                                  <Button
                                    component="a"
                                    variant="outline"
                                    href={prjFile.fileUrl}
                                    target="_blank"
                                    w="100%"
                                    size="lg"
                                  >
                                    Open
                                  </Button>
                                </Flex>
                              </Card>
                            );
                          })
                      }
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>

              </Accordion>

              <Divider w="100%" />
            </>
        }

      </Flex>
    </Flex>
  );
}
