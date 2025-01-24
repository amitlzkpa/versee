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

import ProjectInit_Uninit from "../components/ProjectInit_Uninit";
import ProjectInit_AgreementsUploaded from "../components/ProjectInit_AgreementsUploaded";
import ProjectInit_AgreementsReviewed from "../components/ProjectInit_AgreementsReviewed";
import ProjectInit_SignersAssigned from "../components/ProjectInit_SignersAssigned";
import ProjectInit_TaggingCompleted from "../components/ProjectInit_TaggingCompleted";
import ProjectInit_AgreementSent from "../components/ProjectInit_AgreementSent";


import useCvxUtils from "../hooks/cvxUtils";

export default function Project() {
  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
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
        mb="xl"
        gap="md"
        pb="xl"
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
              <Flex
                w="100%"
                h="100%"
                maw="400"
                direction="column"
                justify="center"
                align="center"
                gap="sm"
                p="lg"
                style={{ textAlign: "center" }}
              >
                <Text>Time to get the ball rolling!</Text>
                <Text fz="lg" lh="1">
                  Upload your agreement and let’s get things moving.
                </Text>
              </Flex>
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
                </Flex>
              </Tabs.Panel>
            </Tabs>
          </Flex>
        </Flex>

      </Flex>

    </Flex>
  );
}
