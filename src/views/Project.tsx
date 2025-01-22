import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Tabs,
  Text,
  Stepper,
  rem,
} from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import Summary_SrcDoc from "../components/Summary_SrcDoc";
import ProjectInit_Uninit from "../components/ProjectInit_Uninit";
import ProjectInit_AgreementsUploaded from "../components/ProjectInit_AgreementsUploaded";
import ProjectInit_AgreementsReviewed from "../components/ProjectInit_AgreementsReviewed";
import ProjectInit_SignersAssigned from "../components/ProjectInit_SignersAssigned";
import ProjectInit_TaggingCompleted from "../components/ProjectInit_TaggingCompleted";
import ProjectInit_AgreementSent from "../components/ProjectInit_AgreementSent";

import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

export default function Project() {
  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  // SRCDOC

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

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

  // Stepper

  const tabVals = useMemo(() => [
    "uninitialized",
    "agreements_uploaded",
    "agreements_reviewed",
    "signers_assigned",
    "tagging_completed",
    "agreement_sent"
  ], []);
  const [active, setActive] = useState(0);
  const [activeTabVal, setActiveTabVal] = useState("");

  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const handleStepChange = (nextStep: any) => {
    const isOutOfBounds = nextStep > tabVals.length || nextStep < 0;
    if (isOutOfBounds) {
      return;
    }
    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  useEffect(() => {
    if (!currProject?.initializationStatus) return;
    const activeIdx = tabVals.indexOf(currProject?.initializationStatus);
    setActive(activeIdx);
    setHighestStepVisited(currProject?.initializationStatus);
  }, [currProject, tabVals]);

  const shouldAllowSelectStep = (step: any) => highestStepVisited >= step && active !== step;

  useEffect(() => {
    setActiveTabVal(tabVals[active]);
  }, [active, tabVals]);

  return (
    <Flex w="100%" direction="column" align="center" gap="sm" p="lg">

      <Flex
        w="100%"
        m="xl"
        gap="md"
      >
        {/* Step selector */}
        <Flex
          w="30%"
          direction="column"
          align="stretch"
        >
          <Stepper active={active} onStepClick={handleStepChange} orientation="vertical">
            <Stepper.Step
              label="First step"
              description="Upload your papers"
              allowStepSelect={shouldAllowSelectStep(0)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Upload your papers
                </Text>
              </Center>
            </Stepper.Step>
            <Stepper.Step
              label="Second step"
              description="Review them"
              allowStepSelect={shouldAllowSelectStep(1)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Review and Confirm
                </Text>
              </Center>
            </Stepper.Step>
            <Stepper.Step
              label="Third step"
              description="Add signers"
              allowStepSelect={shouldAllowSelectStep(2)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Add Signers
                </Text>
              </Center>
            </Stepper.Step>
            <Stepper.Step
              label="Fourth step"
              description="Add tags"
              allowStepSelect={shouldAllowSelectStep(3)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Add Tags
                </Text>
              </Center>
            </Stepper.Step>
            <Stepper.Step
              label="Fourth step"
              description="Finalize"
              allowStepSelect={shouldAllowSelectStep(4)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Finalize
                </Text>
              </Center>
            </Stepper.Step>
            <Stepper.Step
              label="Done"
              allowStepSelect={shouldAllowSelectStep(5)}
            >
              <Center>
                <Text style={{ textAlign: "center" }}>
                  Wait for Signers
                </Text>
              </Center>
            </Stepper.Step>
          </Stepper>
        </Flex>

        {/* Step content */}
        <Flex
          w="80%"
          direction="column"
          align="stretch"
        >
          <Flex
            direction="column"
            align="stretch"
            w="100%"
          >
            <Tabs value={activeTabVal}>
              <Tabs.Panel value="uninitialized">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_Uninit projectId={currProject?._id} />
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="agreements_uploaded">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_AgreementsUploaded projectId={currProject?._id} />
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="agreements_reviewed">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_AgreementsReviewed projectId={currProject?._id} />
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="signers_assigned">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_SignersAssigned projectId={currProject?._id} />
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="tagging_completed">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_TaggingCompleted projectId={currProject?._id} />
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="agreement_sent">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  w="100%"
                  h="100%"
                >
                  <ProjectInit_AgreementSent projectId={currProject?._id} />
                  <Accordion w="100%" defaultValue="upload-srcdoc">
                    <Accordion.Item key="list-srcdocs" value="list-srcdocs">
                      <Accordion.Control>
                        <Text size="md" fw="bold">
                          Doocuments
                        </Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Flex w="100%" direction="column" align="center" gap="xs">
                          {(curProjectSrcDocs ?? []).map((srcDoc: any) => {
                            return (
                              <Card key={srcDoc._id} w="100%" withBorder radius="xl">
                                <Flex direction="column" align="stretch" gap="sm">
                                  <Text fz="sm">{srcDoc.titleText}</Text>
                                  <Summary_SrcDoc srcDocId={srcDoc._id} />

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
                                </Flex>
                              </Card>
                            );
                          })}
                        </Flex>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item key="list-prjfiles" value="list-prjfiles">
                      <Accordion.Control>
                        <Text size="md" fw="bold">
                          Received Files
                        </Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Flex w="100%" direction="column" align="center" gap="xs">
                          {(curProjectPrjFiles ?? []).map((prjFile: any) => {
                            return (
                              <Card key={prjFile._id} w="100%" withBorder radius="xl">
                                <Flex direction="column" align="stretch" gap="sm">
                                  <Text fw="bold">{prjFile.titleText}</Text>
                                  <Text>{prjFile.summaryText}</Text>

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
                          })}
                        </Flex>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item key="upload-prjfile" value="upload-prjfile">
                      <Accordion.Control>
                        <Text size="md" fw="bold">
                          Upload Project File
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
                  </Accordion>
                </Flex>
              </Tabs.Panel>
            </Tabs>
          </Flex>
        </Flex>

      </Flex>

    </Flex>
  );
}
