import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  Button,
  Card,
  Paper,
  Drawer,
  Divider,
  Flex,
  Text,
  Pill,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { FaExclamationCircle } from "react-icons/fa";

import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

export default function Preview() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);
  const cvxUtils = useCvxUtils();

  // APPLICATION

  const { applicationId } = useParams();

  const currApplication = useQuery(
    api.dbOps.getApplication_ByApplicationId,
    applicationId
      ? { applicationId: applicationId as Id<"vsApplications"> }
      : "skip"
  );

  // PROJECT

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    currApplication ? { projectId: currApplication.projectId } : "skip"
  );

  // SRCDOCS

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    currApplication ? { projectId: currApplication.projectId } : "skip"
  );

  const [srcDoc, setSrcDoc] = useState<any>({});

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    setSrcDoc(docOne);
  }, [curProjectSrcDocs]);

  const [offeringsJSON, setOfferingsJSON] = useState([]);

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    if (!docOne?.offerings_Text) return;
    setOfferingsJSON(JSON.parse(docOne.offerings_Text));
  }, [curProjectSrcDocs]);

  const [criteriaJSON, setCriteriaJSON] = useState([]);

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    if (!docOne?.criteria_Text) return;
    setCriteriaJSON(JSON.parse(docOne.criteria_Text));
  }, [curProjectSrcDocs]);

  // PRJFILES

  const currApplicationPrjFiles = useQuery(
    api.dbOps.getAllPrjFiles_ForApplication,
    currApplication ? { applicationId: currApplication._id } : "skip"
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
                  applicationId: currApplication?._id,
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

  // LHS PREVIEW

  const [opened, { open, close }] = useDisclosure(false);

  // ACCESS

  const [currUserHasAccess, setCurrUserHasAccess] = useState(true);

  useEffect(() => {
    const currUserEmail = storedUserData?.user?.email;
    if (!currUserEmail) return;
    if (!currApplication) return;
    setCurrUserHasAccess(currUserEmail === currApplication.applicant.email);
  }, [currApplication, storedUserData?.user?.email]);

  return (
    <Flex w="100%" h="100%" gap="sm">
      {currUserHasAccess ? (
        <>
          <Drawer
            h="100%"
            size="xl"
            opened={opened}
            onClose={close}
            withCloseButton={false}
            title={srcDoc?.titleText}
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <Flex w="100%" h="100%" direction="column" align="stretch">
              <embed
                style={{
                  width: "100%",
                  height: "90vh",
                  minHeight: rem(400),
                  borderRadius: rem(20),
                  flexGrow: 1,
                }}
                src={srcDoc.fileUrl}
              />
            </Flex>
          </Drawer>

          <Flex w="30%" direction="column" align="stretch" gap="sm">
            <Flex
              w="100%"
              h="100%"
              direction="column"
              align="stretch"
              style={{ overflowY: "auto" }}
            >
              <Flex w="100%" align="center" pr="xs" py="xs">
                <Text fz="lg" fw="bold" style={{ flexGrow: 1 }}>
                  Eligibility List
                </Text>
                <Button variant="outline" onClick={open}>
                  Full Details
                </Button>
              </Flex>
              <Accordion w="100%">
                {criteriaJSON ? (
                  <Flex w="100%" direction="column" align="stretch" gap="md">
                    {criteriaJSON.map(
                      (criteriaItem: any, criteriaIdx: number) => {
                        return (
                          <Accordion.Item
                            key={criteriaIdx.toString()}
                            value={criteriaIdx.toString()}
                          >
                            <Accordion.Control mb="md">
                              <Flex w="100%" direction="column">
                                <Text fz="md" fw="bold">
                                  {criteriaItem.title}
                                </Text>
                                <Text fz="xs" fw="thin">
                                  {criteriaItem.applies_to}
                                </Text>
                              </Flex>
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Flex
                                w="100%"
                                direction="column"
                                align="stretch"
                                gap="xs"
                              >
                                <Text fz="sm">{criteriaItem.description}</Text>
                                <Flex
                                  w="100%"
                                  align="center"
                                  gap="xs"
                                  py="xs"
                                  style={{ overflowX: "auto" }}
                                >
                                  {(criteriaItem.valid_docs ?? []).map(
                                    (ct: any, cIdx: number) => {
                                      return <Pill key={cIdx}>{ct}</Pill>;
                                    }
                                  )}
                                </Flex>
                              </Flex>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      }
                    )}
                  </Flex>
                ) : (
                  <></>
                )}
              </Accordion>
            </Flex>
          </Flex>

          <Flex
            w="40%"
            h="100%"
            direction="column"
            align="stretch"
            gap="md"
            style={{ overflowY: "auto" }}
          >
            <Flex
              w="100%"
              h="100%"
              direction="column"
              align="stretch"
              gap="md"
              style={{ overflowY: "auto", textAlign: "center" }}
            >
              <Text>Docs</Text>
              <Button
                variant="outline"
                onClick={() => {
                  cvxUtils.performAction_analyseApplication({
                    applicationId: currApplication._id,
                  });
                }}
              >
                Analyse
              </Button>
            </Flex>
          </Flex>

          <Flex w="30%" direction="column" align="center" gap="sm">
            <Flex w="100%" direction="column" align="stretch">
              <FileUploader
                projectId={currProject?._id}
                onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
              />
            </Flex>

            <Divider w="100%" />

            <Flex w="100%" h="100%" direction="column" align="stretch">
              <Text fz="md" fw="bold">
                Uploaded Files
              </Text>

              <Paper
                w="100%"
                h="100%"
                p="md"
                bg="gray.1"
                style={{ flexGrow: 1, overflowY: "auto" }}
              >
                {(currApplicationPrjFiles ?? []).length > 0 ? (
                  (currApplicationPrjFiles ?? []).map((prjFile: any) => {
                    return (
                      <Card key={prjFile._id} w="50%" withBorder p="md">
                        <Flex direction="column" align="stretch" gap="sm">
                          <Text fz="sm" fw="bold">
                            {prjFile.titleText}
                          </Text>

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

                          <Button
                            variant="outline"
                            onClick={() => {
                              cvxUtils.performAction_analysePrjFile({
                                prjFileId: prjFile._id,
                              });
                            }}
                          >
                            Analyse
                          </Button>
                        </Flex>
                      </Card>
                    );
                  })
                ) : (
                  <Flex
                    w="100%"
                    h="100%"
                    justify="center"
                    align="center"
                    p="xl"
                    style={{ textAlign: "center" }}
                  >
                    <Text fz="sm" c="gray.6" fs="italic" w="200">
                      Add your files and let the AI work its magic!
                    </Text>
                  </Flex>
                )}
              </Paper>
            </Flex>
          </Flex>
        </>
      ) : (
        <Flex w="100%" direction="column" align="center" gap="md">
          <Flex w="20%" direction="column" align="center" gap="md">
            <FaExclamationCircle
              style={{
                width: rem(12),
                height: rem(12),
                color: "var(--mantine-color-gray-5)",
              }}
            />
            <Text style={{ textAlign: "center" }}>You do not have access.</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
