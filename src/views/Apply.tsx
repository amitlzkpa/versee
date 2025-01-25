import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  Button,
  Divider,
  Flex,
  Text,
  Pill,
  rem,
} from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

export default function Preview() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);
  const cvxUtils = useCvxUtils();

  // APPLICATION

  const { applicationId } = useParams();

  const currApplication = useQuery(
    api.dbOps.getApplication_ByApplicationId,
    applicationId
      ? { applicationId: applicationId as Id<"vsApplications"> }
      : "skip"
  );

  // PROJECT

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    currApplication ? { projectId: currApplication.projectId } : "skip"
  );

  // SRCDOCS

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    currApplication ? { projectId: currApplication.projectId } : "skip"
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

  // PRJFILES

  const onClick_uploadFiles_PrjFiles = async (droppedFiles: any) => {
    const ps = droppedFiles.map(
      (file: any) =>
        new Promise((resolve, reject) => {
          cvxUtils.performAction_generateUploadUrl().then(async (uploadUrl) => {
            try {
              const result = await fetch(uploadUrl, {
                method: "POST",
                body: file,
              });
              const uploadedCvxFile = await result.json();
              const cvxStoredFileId = uploadedCvxFile.storageId;
              const newPrjFileId =
                await cvxUtils.performAction_createNewPrjFile({
                  projectId: currProject?._id,
                  cvxStoredFileId,
                });
              return resolve(newPrjFileId);
            } catch (err) {
              return reject(err);
            }
          });
        })
    );

    const newPrjFileIds = (await Promise.allSettled(ps))
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  };

  return (
    <Flex w="100%" gap="sm">
      <Flex w="40%" direction="column" align="stretch" gap="sm">
        <Text fz="xl" fw="bold">
          Preview Application
        </Text>

        <Divider />

        <Text>{srcDoc.summaryText}</Text>

        <Flex
          w="100%"
          h="100%"
          direction="column"
          align="stretch"
          style={{ overflowY: "auto" }}
        >
          <Accordion w="100%">
            <Accordion.Item key="first" value="first">
              <Accordion.Control>
                <Text>Scheme</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {offeringsJSON ? (
                  <Flex w="100%" direction="column" align="stretch" gap="md">
                    {offeringsJSON.map((offerItem: any, offerIdx: number) => {
                      return (
                        <Flex
                          w="100%"
                          direction="column"
                          align="center"
                          key={offerIdx}
                        >
                          <Flex w="100%" align="center" gap="sm">
                            <Text fz="md" fw="bold" style={{ flexGrow: 1 }}>
                              {offerItem.title}
                            </Text>
                            <Pill size="sm">
                              {offerItem.quantity} {offerItem.units}
                            </Pill>
                          </Flex>
                          <Text fz="sm">{offerItem.description}</Text>
                        </Flex>
                      );
                    })}
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
                  <Flex w="100%" direction="column" align="stretch" gap="md">
                    {criteriaJSON.map(
                      (criteriaItem: any, criteriaIdx: number) => {
                        return (
                          <Flex
                            w="100%"
                            direction="column"
                            align="stretch"
                            gap="xs"
                            key={criteriaIdx}
                          >
                            <Flex w="100%" align="center" gap="sm">
                              <Text fz="md" fw="bold" style={{ flexGrow: 1 }}>
                                {criteriaItem.title}
                              </Text>
                              <Pill size="sm">{criteriaItem.applies_to}</Pill>
                            </Flex>
                            <Text fz="sm">{criteriaItem.description}</Text>
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

      <Flex
        w="40%"
        h="100%"
        direction="column"
        align="stretch"
        gap="md"
        style={{ overflowY: "auto" }}
      >
        <Text fw="bold" style={{ textAlign: "center" }}>
          {srcDoc.titleText}
        </Text>
        <embed
          style={{
            width: "100%",
            height: "100%",
            borderRadius: rem(20),
          }}
          src={srcDoc.fileUrl}
        />
      </Flex>

      <Flex w="20%" direction="column" align="center" gap="md">
        <FileUploader
          projectId={currProject?._id}
          onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
        />
      </Flex>
    </Flex>
  );
}
