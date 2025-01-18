import { useLocation } from "react-router-dom";
import { Button, Flex } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function OauthCallback_Docusign() {
  // const storedUserData = useQuery(
  //   api.dbOps.getUserData_ForCurrUser
  // );

  const location = useLocation();

  const performAction_retrieveGSheetsToken = useAction(
    api.vsActions.retrieveGSheetsToken
  );

  const [isAuthorized, setIsAuthorized] = useState(false);

  const onClickTest_retrieveGSheetsAccessToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const callbackUrl = `${window.location.origin}/callback/google-sheets`;
    const token = await performAction_retrieveGSheetsToken({
      authCode: code ?? "",
      callbackUrl,
    });
    console.log(token);
    setIsAuthorized(true);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Google Sheets Auth
        {!isAuthorized ? (
          <>
            <Button
              onClick={onClickTest_retrieveGSheetsAccessToken}
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
