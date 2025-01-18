import { Button, Divider, Flex, Text, rem } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FaCheckCircle } from "react-icons/fa";

export default function MyAccount() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);

  const performAction_startDocusignOAuth = useAction(
    api.vsActions.startDocusignOAuth
  );

  const onClick_startDocusignOAuth = async () => {
    const callbackUrl = `${window.location.origin}/callback/docusign`;
    const redirectUri = await performAction_startDocusignOAuth({ callbackUrl });
    window.location.href = redirectUri;
  };

  const performAction_startGWspcOAuth = useAction(
    api.vsActions.startGWspcOAuth
  );

  const onClick_startGWspcOAuth = async () => {
    const callbackUrl = `${window.location.origin}/callback/google-sheets`;
    const redirectUri = await performAction_startGWspcOAuth({ callbackUrl });
    window.location.href = redirectUri;
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        {!storedUserData?.docusignAccessTknObj ? (
          <>
            <Button onClick={onClick_startDocusignOAuth} w="100%" size="lg">
              Connect Docusign
            </Button>
          </>
        ) : (
          <>
            <Flex justify="center" align="center" gap="sm">
              <FaCheckCircle
                style={{
                  width: rem(12),
                  height: rem(12),
                  color: "var(--mantine-color-gray-5)",
                }}
              />
              <Text>Docusign Account Connected</Text>
            </Flex>
          </>
        )}
      </Flex>

      <Divider w="60%" my="lg" />

      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        {!storedUserData?.googleDriveTknObj ? (
          <>
            <Button onClick={onClick_startGWspcOAuth} w="100%" size="lg">
              Connect Google Drive
            </Button>
          </>
        ) : (
          <>
            <Flex justify="center" align="center" gap="sm">
              <FaCheckCircle
                style={{
                  width: rem(12),
                  height: rem(12),
                  color: "var(--mantine-color-gray-5)",
                }}
              />
              <Text>Google Drive Account Connected</Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
