import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion, Button, Divider, Flex, Text, rem } from "@mantine/core";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { FaExclamationCircle } from "react-icons/fa";
import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

export default function Submit() {
  const storedUserData = useQuery(api.dbOps.getUserData_ForCurrUser);
  const cvxUtils = useCvxUtils();

  // PROJECT

  const { projectId } = useParams();

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

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

  // ACCESS

  const [currUserHasAccess, setCurrUserHasAccess] = useState(true);

  // useEffect(() => {
  //   const currUserEmail = storedUserData?.user?.email;
  //   if (!currUserEmail) return;
  //   const signerEmails = (currProject?.signers ?? []).map(
  //     (s: any) => s.signerEmail
  //   );
  //   setCurrUserHasAccess(signerEmails.includes(currUserEmail));
  // }, [currProject, storedUserData?.user?.email]);

  // PRJFILE

  const curProjectPrjFiles = useQuery(
    api.dbOps.getAllPrjFiles_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

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
          Submit Application
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
                          gap="xs"
                          key={offerItem.title}
                        >
                          <Flex w="100%" align="center" gap="sm">
                            <Text>{offerItem.title}</Text>
                          </Flex>
                          <Flex gap="sm">
                            <Text>{offerItem.quantity}</Text>
                            <Text>{offerItem.units}</Text>
                          </Flex>
                          <Text>{offerItem.description}</Text>
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
                            key={criteriaItem.title}
                          >
                            <Flex w="100%" align="center" gap="sm">
                              <Text>{criteriaItem.title}</Text>
                            </Flex>
                            <Flex w="100%" gap="sm" px="sm">
                              <Text fz="md">Applies To:</Text>
                              <Text>{criteriaItem.applies_to}</Text>
                            </Flex>
                            <Text>{criteriaItem.description}</Text>
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
        {currUserHasAccess ? (
          <>
            <FileUploader
              projectId={currProject?._id}
              onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
            />
          </>
        ) : (
          <>
            <Flex justify="center" align="center" gap="sm">
              <FaExclamationCircle
                style={{
                  width: rem(12),
                  height: rem(12),
                  color: "var(--mantine-color-gray-5)",
                }}
              />
              <Text>You do not have access.</Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
