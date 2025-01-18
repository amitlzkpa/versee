import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  rem,
} from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import useCvxUtils from "../hooks/cvxUtils";

export default function ProjectInit_SignersAssigned({ projectId = null }: any) {
  const cvxUtils = useCvxUtils();

  const [docusignSenderConfigUrl, setDocusignSenderConfigUrl] = useState("");

  useEffect(() => {
    (async () => {
      if (docusignSenderConfigUrl) return;

      const urlToAnnotateDocsForSigning =
        await cvxUtils.performAction_createSenderViewFromDoc({
          projectId,
          returnUrl: `${window.location.origin}/completed-signing-annotation`,
        });

      setDocusignSenderConfigUrl(urlToAnnotateDocsForSigning ?? "");
    })();
  }, [projectId, docusignSenderConfigUrl, cvxUtils]);

  useEffect(() => {
    if (!docusignSenderConfigUrl) return;

    const taggingIframe = document.getElementById("tagging-iframe-target");
    taggingIframe!.setAttribute("src", docusignSenderConfigUrl!);
    taggingIframe!.style.visibility = "visible";
  }, [docusignSenderConfigUrl]);

  const onClick_sendDocument = async () => {
    console.log("foo");
  };

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        direction="column"
        align="center"
        gap="sm"
        py="lg"
      >
        <Text>Complete tagging</Text>

        <iframe
          style={{
            width: "100%",
            minHeight: 400,
            height: "100%",
            visibility: "hidden",
            border: 0,
            borderRadius: rem(20),
            resize: "vertical",
          }}
          src=""
          id="tagging-iframe-target"
        />

        <Button w="100%" size="lg" onClick={onClick_sendDocument}>
          Send
        </Button>
      </Flex>
    </>
  );
}
