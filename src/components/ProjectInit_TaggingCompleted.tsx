import { useEffect, useRef, useState } from "react";
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

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import useCvxUtils from "../hooks/cvxUtils";

export default function ProjectInit_TaggingCompleted({
  projectId = null,
}: any) {
  const cvxUtils = useCvxUtils();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const onClick_sendDocument = async () => {
    console.log("foo");
    const envelopeSummary = await cvxUtils.performAction_sendDocusignEnvelope({
      projectId,
    });
    console.log(envelopeSummary);
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
        style={{ textAlign: "center" }}
      >
        <Text>Send Agreement for Signing</Text>

        <Text>{currProject?.envelopeId}</Text>

        <Button w="100%" size="lg" onClick={onClick_sendDocument}>
          Send
        </Button>
      </Flex>
    </>
  );
}
