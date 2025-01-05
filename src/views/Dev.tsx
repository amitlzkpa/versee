import { useState } from 'react';
import { Button, Card, Flex, Input, Loader, Text } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  const { user } = useUser();

  const currUserVsMsgs = useQuery(api.dbOps.getVsMsgsForUser);
  const addNewVsMsg = useMutation(api.dbOps.createVsMsg);

  const [msg, setMsg] = useState("");

  const onClick = async () => {
    if (!msg) return;
    console.log("Adding new message...");
    addNewVsMsg({
      newVsMsgContent: msg
    })
    setMsg("");
    console.log("Added message!");
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
        <Flex w="60%" direction="column" align="center" gap="md" p="lg">
          <Flex w="100%" align="center" gap="sm">
            <Text>
              {user?.firstName ?? "You"}:
            </Text>
            <Input
              value={msg}
              onChange={(event) => setMsg(event.currentTarget.value)}
              placeholder="type your message..."
              size="lg"
              radius="xl"
              style={{ flexGrow: 1 }}
            />
            <Button
              onClick={onClick}
              size="lg"
            >
              Add
            </Button>
          </Flex>

          <Flex w="100%" direction="column" align="stretch" gap="xs">
            {
              (currUserVsMsgs ?? [])
                .map((msg, idx) => {
                  return (
                    <Card w="100%" withBorder radius="xl">
                      <Text key={idx}>{msg.msgContent}</Text>
                    </Card>
                  );
                })
            }
          </Flex>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
