import { Button, Divider, Flex, Loader } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  const performAction_sendDocusignSigningEmail = useAction(api.vsActions.sendDocusignSigningEmail);

  const onClickTest_sendDocusignSigningEmail = async () => {
    console.log("Sending signing email...");
    const res = await performAction_sendDocusignSigningEmail();
    const sentEnvelopSummary = JSON.parse(res);
    console.log(sentEnvelopSummary);
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
          <Button
            onClick={onClickTest_sendDocusignSigningEmail}
            w="100%"
            size="lg"
          >
            Send Signing Email
          </Button>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
