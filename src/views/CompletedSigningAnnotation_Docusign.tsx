import { useEffect, useRef, useState } from "react";
import { Button, Flex } from "@mantine/core";

export default function CompletedSigningAnnotation_Docusign() {
  useEffect(() => {
    console.log("foo");
  }, []);

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <Flex w="60%" direction="column" align="center" gap="md" p="lg">
        Tags Added!
      </Flex>
    </Flex>
  );
}
