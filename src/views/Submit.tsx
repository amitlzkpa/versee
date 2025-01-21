import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Divider, Flex, Text, rem } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { FaExclamationCircle } from "react-icons/fa";

import useCvxUtils from "../hooks/cvxUtils";

export default function Submit() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);
  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const [currUserHasAccess, setCurrUserHasAccess] = useState(false);

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        <Text>Submit</Text>
        <Text fz="lg">Use this page to submit files.</Text>
      </Flex>

      <Divider w="60%" my="lg" />

      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        {currUserHasAccess ? (
          <>
            <Button w="100%" size="lg">
              Submit File
            </Button>
          </>
        ) : (
          <>
            <Flex justify="center" align="center" gap="sm">
              <FaExclamationCircle
                style={{
                  width: rem(12),
                  height: rem(12),
                  color: "var(--mantine-color-gray-5)",
                }}
              />
              <Text>You do not have access.</Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
