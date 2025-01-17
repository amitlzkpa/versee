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
        py="lg"
      >
        <Text fz="xl" fw="bold" w="100%">
          Agreement Papers
          ({(curProjectSrcDocs ?? []).length})
        </Text>
        <Carousel
          w="100%"
          h="100%"
          slideSize="80%"
          slideGap="md"
          withIndicators={true}
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
                      style={{ overflowY: "auto" }}
                    >
                      <Text fz="sm">{srcDoc._id}</Text>
                      <Text fw="bold">{srcDoc.titleText}</Text>

                      <embed
                        style={{
                          width: "100%",
                          height: rem(400),
                          borderRadius: rem(20)
                        }}
                        src={srcDoc.fileUrl}
                      />

                      <Button
                        component="a"
                        variant="transparent"
                        href={srcDoc.fileUrl}
                        target="_blank"
                        w="100%"
                        size="sm"
                      >
                        Open
                      </Button>

                      <Text>{srcDoc.summaryText}</Text>
                    </Flex>
                  </Carousel.Slide>
                );
              })
          }
        </Carousel>
      </Flex>
    </>
  );
};