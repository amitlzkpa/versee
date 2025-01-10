import { useNavigate } from "react-router-dom";
import { Button, Card, Flex, Text, UnstyledButton } from '@mantine/core';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const navigate = useNavigate();

  const performAction_createNewProject = useAction(api.vsActions.testAction_createNewProject);

  const onClickTest_createNewProject = async () => {
    const newProject = await performAction_createNewProject();
    navigate(`/p/${newProject}`);
  };

  const currUserProjects = useQuery(api.dbOps.getAllProjectsForCurrUser);

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        <Button
          onClick={onClickTest_createNewProject}
          w="100%"
          size="lg"
        >
          Create New Project
        </Button>
      </Flex>

      <Flex w="50%" direction="column" align="center" gap="xs">
        <Text fz="md" fw="bold">My Projects</Text>
        {
          (currUserProjects ?? [])
            .map((prj) => {
              return (
                <UnstyledButton
                  component="a"
                  w="100%"
                  href={`/p/${prj._id}`}
                >
                  <Card
                    w="100%"
                    withBorder
                    radius="xl"
                  >
                    <Text key={prj._id}>{prj._id}</Text>
                  </Card>
                </UnstyledButton>
              );
            })
        }
      </Flex>
    </Flex>
  );
}
