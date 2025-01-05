import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

export default function OauthCallback_Docusign() {

  const { code } = useParams();

  const performAction_testAction_debugTwo = useAction(api.vsActions.testAction_debugTwo);

  const onClickTest_debugTwo = async () => {
    console.log("======================================");
    console.log("code");
    console.log(code);
    const accessToken = await performAction_testAction_debugTwo({ authCode: code ?? "" });
    console.log("======================================");
    console.log("accessToken");
    console.log(accessToken);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      OAuth
      <Button
        onClick={onClickTest_debugTwo}
        w="100%"
        size="lg"
      >
        Test
      </Button>
    </Flex>
  );
}
