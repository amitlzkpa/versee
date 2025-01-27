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
