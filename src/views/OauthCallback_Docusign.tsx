import { useLocation } from 'react-router-dom';
import { Button, Flex, Loader } from '@mantine/core';

import { Authenticated, Unauthenticated, AuthLoading, useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function OauthCallback_Docusign() {

  const location = useLocation();

  const performAction_getAccessToken = useAction(api.vsActions.getAccessToken);

  const onClickTest_getAccessToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const savedRecord = await performAction_getAccessToken({ authCode: code ?? "" });
    console.log(savedRecord);
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
          Docusign OAuth
          <Button
            onClick={onClickTest_getAccessToken}
            w="100%"
            size="lg"
          >
            Get Access Token
          </Button>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
