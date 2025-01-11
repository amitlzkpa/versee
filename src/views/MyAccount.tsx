import { Button, Flex } from '@mantine/core';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MyAccount() {

  const docusignData_ForCurrUser = useQuery(api.dbOps.getDocusignData_ForCurrUser);

  const performAction_startDocusignOAuth = useAction(api.vsActions.startDocusignOAuth);

  const onClick_startDocusignOAuth = async () => {
    const redirectUri = await performAction_startDocusignOAuth();
    window.location.href = redirectUri;
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        <Button
          onClick={onClick_startDocusignOAuth}
          w="100%"
          size="lg"
        >
          Connect Docusign
        </Button>
      </Flex>
    </Flex>
  );
}
