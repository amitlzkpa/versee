import { useState } from 'react';
import { FaRedo, FaTrash } from 'react-icons/fa';
import { Button, Card, Divider, Flex, Input, Loader, Text } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  const { user } = useUser();

  const currUserVsMsgs = useQuery(api.dbOps.getVsMsgsForUser);
  const addNewVsMsg = useMutation(api.dbOps.createVsMsg);

  const [msg, setMsg] = useState("");

  const onClickAdd = async () => {
    if (!msg) return;
    console.log("Adding new message...");
    addNewVsMsg({
      newVsMsgContent: msg
    })
    setMsg("");
    console.log("Added message!");
  };

  const performAction_testAction_reverseText = useAction(api.vsActions.testAction_reverseText);

  const onClickTest = async () => {
    const reverseText = await performAction_testAction_reverseText({ inputText: msg });
    setMsg(reverseText);
  };

  const performAction_testAction_deleteMsgs = useAction(api.vsActions.testAction_deleteMsgs);

  const onClickTest_deleteMsgs = async () => {
    console.log("Deleting all messages...");
    const deletedMsgIds = await performAction_testAction_deleteMsgs();
    console.log(`Deleted ${deletedMsgIds.length} messages.`);
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
            <Input
              value={msg}
              onChange={(event) => setMsg(event.currentTarget.value)}
              placeholder="type your message..."
              size="lg"
              radius="xl"
              style={{ flexGrow: 1 }}
            />
            <Button
              onClick={onClickTest}
              size="md"
              variant="outline"
            >
              <FaRedo color="versee-purple" />
            </Button>
            <Button
              onClick={onClickAdd}
              size="lg"
            >
              Add
            </Button>
          </Flex>

          <Divider my="md" />

          <Flex w="100%" direction="column" align="stretch" gap="xs">
            <Flex w="100%" justify="space-between" align="center" gap="xs">
              <Text>
                {user?.firstName ? `${user?.firstName}'s` : "Your"} messages
              </Text>
              <Button
                onClick={onClickTest_deleteMsgs}
                size="md"
                variant="outline"
              >
                <FaTrash color="versee-purple" />
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
        </Flex>
      </Authenticated>
    </Flex>
  );
}
