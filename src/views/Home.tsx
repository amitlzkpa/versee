import { Flex } from '@mantine/core';

export default function Home() {

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      {Array(45)
        .fill(0)
        .map((_, index) => (
          <div key={index}>Home</div>
        ))}
    </Flex>
  );
}
