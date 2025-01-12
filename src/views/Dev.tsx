import { Button, Divider, Flex, Loader, Text } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <AuthLoading>
        <Loader size="md" />
      </AuthLoading>
      <Unauthenticated>
        <Flex justify="center" p="lg">
          Please login
        </Flex>
      </Unauthenticated>
      <Authenticated>
        <Flex w="60%" direction="column" align="center" gap="md" p="lg">
          <Text>Nothing here</Text>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
