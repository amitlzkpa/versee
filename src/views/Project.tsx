import { useParams } from "react-router-dom";
import { Flex, Text } from '@mantine/core';

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Project() {
  const { projectId } = useParams();

  const currProject = useQuery(api.dbOps.getProject, projectId ? { projectId } : "skip");

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column">
        <Text size="sm">
          ProjectId: {currProject?._id}
        </Text>
        <Text size="lg" fw="bold">
          Creator: {currProject?.user.name}
        </Text>
      </Flex>
    </Flex>
  );
}
