import { useRef, useState } from "react";
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
import { FaTrashAlt } from "react-icons/fa";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import useCvxUtils from "../hooks/cvxUtils";

export default function ProjectInit_SignersAssigned({ projectId = null }: any) {
  const cvxUtils = useCvxUtils();

  const onClick_sendDocument = async () => {
    console.log("foo");
    // const urlToAnnotateDocsForSigning =
    //   await cvxUtils.performAction_createSenderViewFromDoc({
    //     projectId,
    //     signers,
    //     returnUrl: `${window.location.origin}/completed-signing-annotation`,
    //   });
    // if (urlToAnnotateDocsForSigning) {
    //   window.location.href = urlToAnnotateDocsForSigning;
    // }
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
        <Button w="100%" size="lg" onClick={onClick_sendDocument}>
          Send
        </Button>
      </Flex>
    </>
  );
}
