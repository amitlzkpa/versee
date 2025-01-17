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
import { Carousel } from '@mantine/carousel';

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
        <Flex
          w="100%"
          h="100%"
          mih="400"
          direction="column"
          align="center"
          gap="sm"
          style={{ border: "1px solid red" }}
        >
          <Text fz="xl" fw="bold" w="100%">Agreement Papers</Text>
          <Carousel
            w="100%"
            h="100%"
            slideSize="80%"
            slideGap="md"
            style={{ border: "1px solid green" }}
          >
            {
              (curProjectSrcDocs ?? [])
                .map((srcDoc: any) => {
                  return (
                    <Carousel.Slide key={srcDoc._id}>
                      <Flex
                        w="100%"
                        h="100%"
                        direction="column"
                        align="center"
                        gap="sm"
                        style={{ border: "1px solid blue", overflowY: "auto" }}
                      >
                        <Text fz="sm">{srcDoc._id}</Text>
                        <Text fw="bold">{srcDoc.titleText}</Text>

                        <embed
                          style={{ width: "100%", height: "100%", minHeight: "400px" }}
                          src={srcDoc.fileUrl}
                        />

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
                    </Carousel.Slide>
                  );
                })
            }
          </Carousel>
        </Flex>
      </Flex>
    </>
  );
};