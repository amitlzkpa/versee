import { useLocation } from "react-router-dom";
import { Button, Flex } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function OauthCallback_Docusign() {
  const docusignData_ForCurrUser = useQuery(
    api.dbOps.getDocusignData_ForCurrUser
  );

  const location = useLocation();

  const performAction_retrieveDocusignAccessToken = useAction(
    api.vsActions.retrieveDocusignAccessToken
  );

  const onClickTest_retrieveDocusignAccessToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const savedRecord = await performAction_retrieveDocusignAccessToken({
      authCode: code ?? "",
    });
    console.log(savedRecord);
  };

  const performAction_retrieveDocusignUserToken = useAction(
    api.vsActions.retrieveDocusignUserToken
  );

  const onClickTest_retrieveDocusignUserToken = async () => {
    const savedRecord = await performAction_retrieveDocusignUserToken();
    console.log(savedRecord);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Docusign Auth
        {!docusignData_ForCurrUser?.accessTokenObj ? (
          <>
            <Button
              onClick={onClickTest_retrieveDocusignAccessToken}
              w="100%"
              size="lg"
            >
              Get Access Token
            </Button>
          </>
        ) : (
          <></>
        )}
        {docusignData_ForCurrUser?.accessTokenObj &&
        !docusignData_ForCurrUser?.userTokenObj ? (
          <>
            <Button
              onClick={onClickTest_retrieveDocusignUserToken}
              variant="outline"
              w="100%"
              size="lg"
            >
              Get User Token
            </Button>
          </>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
}
