import { useNavigate } from "react-router-dom";
import { Button, Flex } from '@mantine/core';

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const navigate = useNavigate();

  const performAction_createNewProject = useAction(api.vsActions.testAction_createNewProject);

  const onClickTest_createNewProject = async () => {
    const newProject = await performAction_createNewProject();
    navigate(`/p/${newProject}`);
  };

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
    </Flex>
  );
}
