import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Flex } from "@mantine/core";

export default function CompletedSigningAnnotation_Docusign() {
  const location = useLocation();

  useEffect(() => {
    console.log("iframe foo");
    console.log(location);

    const queryParams = new URLSearchParams(location.search);
    const envelopeId = queryParams.get("envelopeId");

    window.parent.postMessage(envelopeId, window.location.origin);
  }, [location]);

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Tags Added!
      </Flex>
    </Flex>
  );
}
