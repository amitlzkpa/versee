import { useLocation } from "react-router-dom";
import { Button, Flex } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function OauthCallback_Docusign() {
  // const docusignData_ForCurrUser = useQuery(
  //   api.dbOps.getDocusignData_ForCurrUser
  // );

  // const location = useLocation();

  // const performAction_retrieveDocusignAccessToken = useAction(
  //   api.vsActions.retrieveDocusignAccessToken
  // );

  const [isAuthorized, setIsAuthorized] = useState(false);

  const onClickTest_retrieveGSheetsAccessToken = async () => {
    console.log("onClickTest_retrieveGSheetsAccessToken");
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
