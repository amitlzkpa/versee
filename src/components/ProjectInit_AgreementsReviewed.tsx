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
import { Link } from "react-router-dom";

export default function ProjectInit_AgreementsReviewed({
  projectId = null,
}: any) {
  const cvxUtils = useCvxUtils();

  const [signersList, setSignersList] = useState<any>([]);

  const [newSignerName, setNewSignerName] = useState("");
  const [newSignerEmail, setNewSignerEmail] = useState("");

  const handleAddSigner = () => {
    const updSignersList = [
      ...signersList,
      {
        signerName: newSignerName,
        signerEmail: newSignerEmail,
      },
    ];
    setSignersList(updSignersList);
    setNewSignerName("");
    setNewSignerEmail("");
  };

  const handleDeleteSigner = (signer: any) => {
    const updSignersList = signersList.filter(
      (s: any) => s.signerEmail !== signer.signerEmail
    );
    setSignersList(updSignersList);
  };

  const onClick_completeAddingSigners = async () => {
    const updateData = JSON.stringify({
      initializationStatus: "signers_assigned",
      signers: signersList,
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
        <Card
          w="100%"
          h="100%"
          c="versee-purple"
          variant="outline"
          style={{ borderStyle: "dashed" }}
        >
          <Link
            to={`/preview/${projectId}`}
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <Flex
              w="100%"
              h="100%"
              p="sm"
              direction="column"
              justify="center"
              align="center"
              style={{ textAlign: "center" }}
            >
              <Text fz="xs" c="gray.6">
                Public Link
              </Text>
              <Text fz="sm" c="versee-purple">
                {`${window.location.origin}/preview/${projectId}`}
              </Text>
            </Flex>
          </Link>
        </Card>

        <Accordion w="100%" variant="filled" chevron={null}>
          <Accordion.Item key="first" value="first">
            <Accordion.Control icon="+">
              <Flex w="100%" direction="column" align="center" gap="sm">
                <Text c="gray.5" fz="sm">
                  Add New Signer
                </Text>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <Flex w="100%" direction="column" align="center" gap="md">
                <Flex w="100%" direction="column" align="center" gap="xs">
                  <Input
                    w="100%"
                    onChange={(e) => setNewSignerName(e.target.value)}
                    value={newSignerName}
                    placeholder="New Signer Name"
                  />
                  <Input
                    w="100%"
                    onChange={(e) => setNewSignerEmail(e.target.value)}
                    value={newSignerEmail}
                    placeholder="New Signer Email"
                  />
                </Flex>
                <Button variant="outline" size="lg" onClick={handleAddSigner}>
                  Add
                </Button>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Flex
          w="100%"
          h="100%"
          mih="200"
          mah="400"
          direction="column"
          align="center"
          gap="md"
          style={{ overflowY: "auto" }}
        >
          {signersList.length < 1 ? (
            <Flex
              w="100%"
              h="100%"
              maw="400"
              direction="column"
              justify="center"
              align="center"
              gap="sm"
              style={{ textAlign: "center" }}
            >
              <Text>No signers added yet</Text>
            </Flex>
          ) : (
            signersList.map((signerObj: any, idx: number) => {
              return (
                <Flex
                  key={signerObj.signerEmail}
                  w="100%"
                  direction="row"
                  align="center"
                  gap="md"
                >
                  <Flex h="100%" p="md" align="center" justify="center">
                    <FaTrashAlt
                      color="#ababab"
                      onClick={() => {
                        handleDeleteSigner(signerObj);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </Flex>
                  <Flex w="100%" h="100%" direction="column" justify="center">
                    <Text fw="bold" lh="0.8">
                      {signerObj.signerName}
                    </Text>
                    <Text fz="sm">{signerObj.signerEmail}</Text>
                  </Flex>
                </Flex>
              );
            })
          )}
        </Flex>

        <Button
          w="100%"
          size="lg"
          onClick={onClick_completeAddingSigners}
          disabled={signersList.length < 1}
        >
          Done
        </Button>
      </Flex>
    </>
  );
}
