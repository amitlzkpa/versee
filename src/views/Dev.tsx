import { Button, Flex, Loader } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dev() {

  const performAction_testAction_debugOne = useAction(api.vsActions.testAction_debugOne);

  const onClickTest_debugOne = async () => {
    const redirectUri = await performAction_testAction_debugOne();
    window.location.href = redirectUri;
  };

  const performAction_testAction_sendSigningEmail = useAction(api.vsActions.testAction_sendSigningEmail);

  const onClickTest_sendSigningEmail = async () => {
    console.log("Sending signing email...");
    const res = await performAction_testAction_sendSigningEmail();
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
            onClick={onClickTest_debugOne}
            w="100%"
            size="lg"
          >
            Start Docusign OAuth
          </Button>
          <Button
            onClick={onClickTest_sendSigningEmail}
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
