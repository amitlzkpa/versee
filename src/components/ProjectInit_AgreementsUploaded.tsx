import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Text,
  rem
} from '@mantine/core';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

import useCvxUtils from '../hooks/cvxUtils';

export default function ProjectInit_AgreementsUploaded({
  projectId = null
}: any) {

  const cvxUtils = useCvxUtils();

  // SRCDOC

  const curProjectSrcDocs = useQuery(api.dbOps.getAllSrcDocs_ForProject, projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip");

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        direction="column"
        align="center"
        gap="sm"
      >
        {
          (curProjectSrcDocs ?? [])
            .map((srcDoc: any) => {
              return (
                <Card
                  key={srcDoc._id}
                  w="100%"
                  withBorder
                  radius="xl"
                >
                  <Flex direction="column" align="stretch" gap="sm">
                    <Text fz="sm">{srcDoc._id}</Text>
                    <Text fw="bold">{srcDoc.titleText}</Text>
                    <Text>{srcDoc.summaryText}</Text>

                    <Button
                      component="a"
                      variant="outline"
                      href={srcDoc.fileUrl}
                      target="_blank"
                      w="100%"
                      size="lg"
                    >
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        cvxUtils.performAction_sendDocusignSigningEmail({
                          srcDocId: srcDoc._id
                        });
                      }}
                      w="100%"
                      size="lg"
                    >
                      Send
                    </Button>
                  </Flex>
                </Card>
              );
            })
        }
      </Flex>
    </>
  );
};