import { useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Divider,
  Flex,
  Loader,
  Text,
} from "@mantine/core";

import FileUploader from "../components/FileUploader";

import useCvxUtils from "../hooks/cvxUtils";

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useAction,
  useQuery,
} from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export default function Dev() {
  const cvxUtils = useCvxUtils();

  // PROJECT

  const [projectId, setProjectId] = useState(
    "jd7b1wfa7ys2vvws4qa7v48n0s78p3f4"
  );

  const currProject = useQuery(
    api.dbOps.getProject_ByProjectId,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  // SRCDOC

  const curProjectSrcDocs = useQuery(
    api.dbOps.getAllSrcDocs_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const performAction_createNewSrcDoc = useAction(
    api.vsActions.createNewSrcDoc
  );

  const performAction_analyseSrcDoc = useAction(api.vsActions.analyseSrcDoc);

  const onClick_uploadFiles_SrcDoc = async (droppedFiles: any) => {
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
              const newSrcDocId = await performAction_createNewSrcDoc({
                projectId: currProject?._id,
                cvxStoredFileId,
              });
              return resolve(newSrcDocId);
            } catch (err) {
              return reject(err);
            }
          });
        })
    );

    const srcDocIds = (await Promise.allSettled(ps))
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  };

  // PRJFILE

  const curProjectPrjFiles = useQuery(
    api.dbOps.getAllPrjFiles_ForProject,
    projectId ? { projectId: projectId as Id<"vsProjects"> } : "skip"
  );

  const performAction_createNewPrjFile = useAction(
    api.vsActions.createNewPrjFile
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
              const newPrjFileId = await performAction_createNewPrjFile({
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

  // GSHEETS

  const performAction_test_readSheet = useAction(api.vsActions.test_readSheet);

  const onClick_performAction_test_readSheet = async () => {
    console.log("foo");
    const d = await performAction_test_readSheet({
      // grv_data: "BeSure data for Novartis Events"
      sheetId: "1jQyuFl1DVx6W0Gqnpc7Ux5rXONoW-FtV1QhtOYUpT7A",
      sheetRange: "Sheet1!A1:D10",
    });
    console.log(d);
  };

  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      <AuthLoading>
        <Loader size="md" />
      </AuthLoading>
      <Unauthenticated>
        <Flex justify="center" p="lg">
          Please login
        </Flex>
      </Unauthenticated>
      <Authenticated>
        <Flex w="60%" direction="column" align="stretch" gap="md" p="lg">
          <Button
            w="100%"
            onClick={onClick_performAction_test_readSheet}
            size="lg"
          >
            G Sheets Test
          </Button>

          <Accordion defaultValue="upload-srcdoc">
            <Accordion.Item key="upload-srcdoc" value="upload-srcdoc">
              <Accordion.Control>
                <Text size="md" fw="bold">
                  Upload Associated Agreement
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex direction="column">
                  <FileUploader
                    projectId={currProject?._id}
                    onClick_uploadFiles={onClick_uploadFiles_SrcDoc}
                  />
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="list-srcdocs" value="list-srcdocs">
              <Accordion.Control>
                <Text size="md" fw="bold">
                  View Agreements
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex w="100%" direction="column" align="center" gap="xs">
                  {(curProjectSrcDocs ?? []).map((srcDoc: any) => {
                    return (
                      <Card key={srcDoc._id} w="100%" withBorder radius="xl">
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
                              performAction_analyseSrcDoc({
                                srcDocId: srcDoc._id,
                              });
                            }}
                            w="100%"
                            size="lg"
                          >
                            Analyse
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              cvxUtils.performAction_sendDocusignSigningEmail({
                                srcDocId: srcDoc._id,
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
                  })}
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="upload-prjfile" value="upload-prjfile">
              <Accordion.Control>
                <Text size="md" fw="bold">
                  Upload Project Files
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex direction="column">
                  <FileUploader
                    projectId={currProject?._id}
                    onClick_uploadFiles={onClick_uploadFiles_PrjFiles}
                  />
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="list-prjfiles" value="list-prjfiles">
              <Accordion.Control>
                <Text size="md" fw="bold">
                  View Project Files
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex w="100%" direction="column" align="center" gap="xs">
                  {(curProjectPrjFiles ?? []).map((prjFile: any) => {
                    return (
                      <Card key={prjFile._id} w="100%" withBorder radius="xl">
                        <Flex direction="column" align="stretch" gap="sm">
                          <Text fz="sm">{prjFile._id}</Text>
                          <Text fw="bold">{prjFile.titleText}</Text>
                          <Text>{prjFile.summaryText}</Text>

                          <Button
                            component="a"
                            variant="outline"
                            href={prjFile.fileUrl}
                            target="_blank"
                            w="100%"
                            size="lg"
                          >
                            Open
                          </Button>
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Flex>
      </Authenticated>
    </Flex>
  );
}
