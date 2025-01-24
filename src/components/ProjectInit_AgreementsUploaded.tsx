import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Text,
  rem,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import Summary_SrcDoc from "../components/Summary_SrcDoc";

import useCvxUtils from "../hooks/cvxUtils";

export default function ProjectInit_AgreementsUploaded({
  projectId = null,
}: any) {
  const cvxUtils = useCvxUtils();

  const performAction_analyseSrcDoc = useAction(api.vsActions.analyseSrcDoc);

  const onClick_analyseDoc = async (srcDocId: any) => {
    await performAction_analyseSrcDoc({
      srcDocId: srcDocId,
    });
  };

  // SRCDOC

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const onClick_confirmAgreementReview = async () => {
    const updateData = JSON.stringify({
      initializationStatus: "agreements_reviewed",
    });

    await cvxUtils.performAction_updateProject({ projectId, updateData });
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
        <Text fz="lg" fw="bold">
          Agreement Papers ({(curProjectSrcDocs ?? []).length})
        </Text>

        <Carousel
          w="100%"
          h="100%"
          slideSize="80%"
          slideGap="md"
          withIndicators={true}
        >
          {(curProjectSrcDocs ?? []).map((srcDoc: any) => {
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
                  <Text fw="bold">{srcDoc.titleText}</Text>

                  <embed
                    style={{
                      width: "100%",
                      height: rem(400),
                      borderRadius: rem(20),
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

                  <Button
                    variant="outline"
                    w="100%"
                    size="sm"
                    onClick={() => onClick_analyseDoc(srcDoc._id)}
                  >
                    Analyse
                  </Button>

                  <Summary_SrcDoc srcDocId={srcDoc._id} />

                  {
                    srcDoc.offerings_Text
                      ?
                      <Text>
                        <pre
                          style={{ textWrap: "pretty" }}
                        >
                          {JSON.stringify(JSON.parse(srcDoc.offerings_Text), null, 2)}
                        </pre>
                      </Text>
                      :
                      <></>
                  }

                  {srcDoc.criteria_Text
                    ?
                    <Text>
                      <pre
                        style={{ textWrap: "pretty" }}
                      >
                        {JSON.stringify(JSON.parse(srcDoc.criteria_Text), null, 2)}
                      </pre>
                    </Text>
                    :
                    <></>

                  }

                </Flex>
              </Carousel.Slide>
            );
          })}
        </Carousel>

        <Button w="100%" size="lg" onClick={onClick_confirmAgreementReview}>
          Confirm
        </Button>
      </Flex>
    </>
  );
}
