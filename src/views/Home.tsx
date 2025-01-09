import { Button, Flex } from '@mantine/core';

export default function Home() {

  const onClickTest_createNewProject = async () => {
    console.log("foo");
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
