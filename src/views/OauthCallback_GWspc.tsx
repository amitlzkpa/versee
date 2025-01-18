import { useLocation } from "react-router-dom";
import { Button, Flex } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function OauthCallback_GWspc() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);

  const location = useLocation();

  const performAction_retrieveGWspcToken = useAction(
    api.vsActions.retrieveGWspcToken
  );

  const onClickTest_retrieveGWspcAccessToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const callbackUrl = `${window.location.origin}/callback/google-workspace`;
    const savedRecord = await performAction_retrieveGWspcToken({
      authCode: code ?? "",
      callbackUrl,
    });
    console.log(savedRecord);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Google Workspace Auth
        {!storedUserData?.googleDriveTknObj ? (
          <>
            <Button
              onClick={onClickTest_retrieveGWspcAccessToken}
              w="100%"
              size="lg"
            >
              Get Access Token
            </Button>
          </>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
}
