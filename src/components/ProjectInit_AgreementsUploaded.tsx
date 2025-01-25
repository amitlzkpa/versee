import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Input,
  Loader,
  Text,
  Textarea,
  rem,
} from "@mantine/core";

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

  const [srcDoc, setSrcDoc] = useState<any>({});

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    setSrcDoc(docOne);
  }, [curProjectSrcDocs]);

  const [offeringsJSON, setOfferingsJSON] = useState([]);

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    if (!docOne?.offerings_Text) return;
    setOfferingsJSON(JSON.parse(docOne.offerings_Text));
  }, [curProjectSrcDocs]);

  const [criteriaJSON, setCriteriaJSON] = useState([]);

  useEffect(() => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    if (!docOne?.criteria_Text) return;
    setCriteriaJSON(JSON.parse(docOne.criteria_Text));
  }, [curProjectSrcDocs]);

  const onClick_confirmAgreementReview = async () => {
    if ((curProjectSrcDocs ?? []).length < 1) return;
    const docOne: any = (curProjectSrcDocs ?? [])[0];
    const offeringsText = JSON.stringify(offeringsJSON);
    const criteriaText = JSON.stringify(criteriaJSON);
    const updateData_srcdoc = JSON.stringify({
      offerings_Text: offeringsText,
      criteria_Text: criteriaText,
    });

    await cvxUtils.performAction_updateSrcDoc({
      srcDocId: docOne._id,
      updateDataStr: updateData_srcdoc,
    });
    const updateData_project = JSON.stringify({
      initializationStatus: "agreements_reviewed",
    });
    await cvxUtils.performAction_updateProject({
      projectId,
      updateData: updateData_project,
    });
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

        {(curProjectSrcDocs ?? []).length > 0 ? (
          <Flex w="100%" h="100%" gap="md">
            <Flex
              w="50%"
              h="100%"
              mih="800"
              direction="column"
              align="center"
              gap="sm"
              style={{ overflowY: "auto" }}
            >
              <embed
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: rem(800),
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
            </Flex>
            <Flex w="50%" h="100%" direction="column" align="stretch" gap="md">
              <Button
                w="100%"
                size="lg"
                onClick={onClick_confirmAgreementReview}
              >
                Confirm
              </Button>

              <Divider my="sm" />

              <Text fw="bold">{srcDoc.titleText}</Text>

              <Summary_SrcDoc srcDocId={srcDoc._id} />

              <Accordion w="100%">
                <Accordion.Item key="first" value="first">
                  <Accordion.Control>
                    <Text>Scheme</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {offeringsJSON ? (
                      <Flex
                        w="100%"
                        direction="column"
                        align="stretch"
                        gap="md"
                      >
                        {offeringsJSON.map(
                          (offerItem: any, offerIdx: number) => {
                            return (
                              <Flex
                                w="100%"
                                direction="column"
                                align="center"
                                gap="xs"
                                key={offerItem.title}
                              >
                                <Input
                                  w="100%"
                                  fz="md"
                                  fw="bold"
                                  defaultValue={offerItem.title}
                                  onChange={(e) => {
                                    offerItem.title = e.target.value;
                                  }}
                                />
                                <Flex gap="sm">
                                  <Input
                                    w="60%"
                                    fz="sm"
                                    fw="bold"
                                    defaultValue={offerItem.quantity}
                                    onChange={(e) => {
                                      offerItem.quantity = e.target.value;
                                    }}
                                  />
                                  <Input
                                    w="40%"
                                    fz="sm"
                                    fw="bold"
                                    defaultValue={offerItem.units}
                                    onChange={(e) => {
                                      offerItem.units = e.target.value;
                                    }}
                                  />
                                </Flex>
                                <Textarea
                                  variant="filled"
                                  w="100%"
                                  rows={4}
                                  resize="vertical"
                                  defaultValue={offerItem.description}
                                  onChange={(e) => {
                                    offerItem.description = e.target.value;
                                  }}
                                />
                              </Flex>
                            );
                          }
                        )}
                      </Flex>
                    ) : (
                      <></>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key="second" value="second">
                  <Accordion.Control>
                    <Text>Eligibility</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {criteriaJSON ? (
                      <Flex
                        w="100%"
                        direction="column"
                        align="stretch"
                        gap="md"
                      >
                        {criteriaJSON.map(
                          (criteriaItem: any, criteriaIdx: number) => {
                            return (
                              <Flex
                                w="100%"
                                direction="column"
                                align="stretch"
                                gap="xs"
                                key={criteriaItem.title}
                              >
                                <Input
                                  w="100%"
                                  fz="md"
                                  fw="bold"
                                  defaultValue={criteriaItem.title}
                                  onChange={(e) => {
                                    criteriaItem.title = e.target.value;
                                  }}
                                />
                                <Flex w="100%" gap="sm" px="sm">
                                  <Text fz="md">Applies To:</Text>
                                  <Input
                                    style={{ flexGrow: 1 }}
                                    fz="sm"
                                    fw="bold"
                                    defaultValue={criteriaItem.applies_to}
                                    onChange={(e) => {
                                      criteriaItem.applies_to = e.target.value;
                                    }}
                                  />
                                </Flex>
                                <Textarea
                                  variant="filled"
                                  w="100%"
                                  rows={4}
                                  resize="vertical"
                                  defaultValue={criteriaItem.description}
                                  onChange={(e) => {
                                    criteriaItem.description = e.target.value;
                                  }}
                                />
                              </Flex>
                            );
                          }
                        )}
                      </Flex>
                    ) : (
                      <></>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Flex>
          </Flex>
        ) : (
          <Flex
            w="100%"
            h="100%"
            mih="200"
            direction="column"
            justify="center"
            align="center"
            gap="sm"
          >
            <Loader type="oval" size="xl" />
          </Flex>
        )}
      </Flex>
    </>
  );
}
