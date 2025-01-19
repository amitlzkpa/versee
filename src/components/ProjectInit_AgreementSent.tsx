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

export default function ProjectInit_AgreementSent({ projectId = null }: any) {
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
        <Text fz="lg" fw="bold">
          Agreement Sent
        </Text>
      </Flex>
    </>
  );
}
