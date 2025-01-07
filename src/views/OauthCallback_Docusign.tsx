import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Flex } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

export default function OauthCallback_Docusign() {

  const location = useLocation();

  const performAction_testAction_debugTwo = useAction(api.vsActions.testAction_debugTwo);

  const onClickTest_debugTwo = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const savedRecord = await performAction_testAction_debugTwo({ authCode: code ?? "" });
    console.log(savedRecord);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      OAuth
      <Button
        onClick={onClickTest_debugTwo}
        w="100%"
        size="lg"
      >
        Get Access Token
      </Button>
    </Flex>
  );
}
