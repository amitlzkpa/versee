import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Text,
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

export default function Project() {
  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  return (
    <Flex w="100%" direction="column" align="center" gap="sm" p="lg">
      <Flex w="60%" direction="column" gap="sm" my="lg">
        <Divider w="100%" />

        <Flex direction="column" my="lg">
          <Text size="sm">ProjectId: {currProject?._id}</Text>
          <Text size="lg" fw="bold">
            Creator: {currProject?.creator.name}
          </Text>
        </Flex>

        <Divider w="100%" />

        {(() => {
          switch (currProject?.initializationStatus) {
            case "uninitialized":
              return <ProjectInit_Uninit projectId={currProject?._id} />;
            case "agreements_uploaded":
              return (
                <ProjectInit_AgreementsUploaded projectId={currProject?._id} />
              );
            case "agreements_reviewed":
              return (
                <ProjectInit_AgreementsReviewed projectId={currProject?._id} />
              );
            case "signers_assigned":
              return (
                <ProjectInit_SignersAssigned projectId={currProject?._id} />
              );
            case "tagging_completed":
              return (
                <ProjectInit_TaggingCompleted projectId={currProject?._id} />
              );
            case "agreement_sent":
              return <ProjectInit_AgreementSent projectId={currProject?._id} />;
            default:
              return null;
          }
        })()}

        <Divider w="100%" />
      </Flex>
    </Flex>
  );
}
