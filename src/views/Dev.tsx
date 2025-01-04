import { useState } from 'react';
import { Button, Flex, Loader, Text } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useUser } from "@clerk/clerk-react";

export default function Dev() {

  const { user } = useUser();
  const [msg, setMsg] = useState("");

  const onClick = async () => {
    console.log("foo");
    setMsg("click");
  };

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
        <Flex direction="column" justify="center" gap="md" p="lg">
          <Text>
            {user?.fullName}
          </Text>
          <Button
            onClick={onClick}
            size="lg"
          >
            Go
          </Button>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
