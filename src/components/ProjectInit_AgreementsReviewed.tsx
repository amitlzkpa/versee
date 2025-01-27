import { useRef, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  rem,
} from "@mantine/core";
import { FaAddressBook } from "react-icons/fa";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import useCvxUtils from "../hooks/cvxUtils";
import { Link } from "react-router-dom";

export default function ProjectInit_AgreementsReviewed({
  projectId = null,
}: any) {
  const cvxUtils = useCvxUtils();

  const [signersList, setSignersList] = useState<any>([]);

  const applicationsReceived = useQuery(
    api.dbOps.getApplications_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const onClick_completeAddingSigners = async () => {
    const updateData = JSON.stringify({
      initializationStatus: "signers_assigned",
      signers: signersList,
    });

    await cvxUtils.performAction_updateProject({ projectId, updateData });
  };

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        direction="column"
        align="center"
        gap="sm"
        py="lg"
      >
        <Card
          w="100%"
          h="100%"
          c="versee-purple"
          variant="outline"
          style={{ borderStyle: "dashed" }}
        >
          <Link
            to={`/preview/${projectId}`}
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <Flex
              w="100%"
              h="100%"
              p="sm"
              direction="column"
              justify="center"
              align="center"
              style={{ textAlign: "center" }}
            >
              <Text fz="xs" c="gray.6">
                Public Link
              </Text>
              <Text fz="sm" c="versee-purple">
                {`${window.location.origin}/preview/${projectId}`}
              </Text>
            </Flex>
          </Link>
        </Card>

        <Accordion w="100%">
          <Accordion.Item key="first" value="first">
            <Accordion.Control>
              <Flex w="100%" direction="column" align="center" gap="sm">
                <Text c="gray.5">Applications Received</Text>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <Flex w="100%" direction="column" align="center" gap="md">
                <Flex
                  w="100%"
                  h="100%"
                  mih="200"
                  mah="400"
                  direction="column"
                  align="center"
                  gap="md"
                  style={{ overflowY: "auto" }}
                >
                  {(applicationsReceived ?? []).length < 1 ? (
                    <Flex
                      w="100%"
                      h="100%"
                      maw="400"
                      direction="column"
                      justify="center"
                      align="center"
                      gap="sm"
                      style={{ textAlign: "center" }}
                    >
                      <Text>No applications received yet</Text>
                    </Flex>
                  ) : (
                    (applicationsReceived ?? []).map(
                      (application: any, idx: number) => {
                        return (
                          <Flex
                            key={application._id}
                            w="100%"
                            direction="row"
                            align="center"
                            gap="md"
                          >
                            <Flex
                              h="100%"
                              p="md"
                              align="center"
                              justify="center"
                            >
                              <FaAddressBook
                                color="#ababab"
                                onClick={() => {
                                  console.log(application);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </Flex>
                            <Flex
                              w="100%"
                              h="100%"
                              direction="column"
                              justify="center"
                            >
                              <Text fw="bold" lh="0.8">
                                {application._id}
                              </Text>
                              <Text fz="sm">
                                {application?.applicant?.email ?? ""}
                              </Text>
                            </Flex>
                          </Flex>
                        );
                      }
                    )
                  )}
                </Flex>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Button
          w="100%"
          size="lg"
          onClick={onClick_completeAddingSigners}
          disabled={(applicationsReceived ?? []).length < 1}
        >
          Done
        </Button>
      </Flex>
    </>
  );
}
