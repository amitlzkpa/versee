import { useLocation } from 'react-router-dom';
import { Button, Flex } from '@mantine/core';

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function OauthCallback_Docusign() {

  const location = useLocation();

  const performAction_getDocusignAccessToken = useAction(api.vsActions.getDocusignAccessToken);

  const onClickTest_getDocusignAccessToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const savedRecord = await performAction_getDocusignAccessToken({ authCode: code ?? "" });
    console.log(savedRecord);
  };

  const performAction_getDocusignUserToken = useAction(api.vsActions.getDocusignUserToken);

  const onClickTest_getDocusignUserToken = async () => {
    const savedRecord = await performAction_getDocusignUserToken();
    console.log(savedRecord);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Docusign OAuth
        <Button
          onClick={onClickTest_getDocusignAccessToken}
          w="100%"
          size="lg"
        >
          Get Access Token
        </Button>
        <Button
          onClick={onClickTest_getDocusignUserToken}
          w="100%"
          size="lg"
        >
          Get User Token
        </Button>
      </Flex>
    </Flex>
  );
}
