import { useRef, useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  rem
} from '@mantine/core';
import { FaTrashAlt } from 'react-icons/fa';

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

import FileUploader from './FileUploader';

import useCvxUtils from '../hooks/cvxUtils';

export default function ProjectInit_AgreementsReviewed({
  projectId = null
}: any) {

  const cvxUtils = useCvxUtils();

  const [signersList, setSignersList] = useState<any>([]);

  const [newSignerName, setNewSignerName] = useState("");
  const [newSignerEmail, setNewSignerEmail] = useState("");

  const handleAddSigner = () => {
    const updSignersList = [...signersList, {
      signerName: newSignerName,
      signerEmail: newSignerEmail
    }];
    console.log(updSignersList);
    setSignersList(updSignersList);
    setNewSignerName("");
    setNewSignerEmail("");
  };

  const handleDeleteSigner = (signer: any) => {
    const updSignersList = signersList.filter((s: any) => s.signerEmail !== signer.signerEmail);
    setSignersList(updSignersList);
  };

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
          direction="column"
          align="center"
          gap="sm"
        >
          {
            signersList.map((signerObj: any, idx: number) => {
              return (
                <Flex
                  key={signerObj.signerEmail}
                  w="100%"
                  h="100%"
                  direction="row"
                  align="center"
                  gap="md"
                >
                  <Flex
                    h="100%"
                    p="md"
                    align="center"
                    justify="center"
                  >
                    <FaTrashAlt
                      color="#ababab"
                      onClick={() => { handleDeleteSigner(signerObj) }}
                      style={{ cursor: "pointer" }}
                    />
                  </Flex>
                  <Flex
                    w="100%"
                    h="100%"
                    direction="column"
                    justify="center"
                  >
                    <Text fw="bold" lh="0.8">
                      {signerObj.signerName}
                    </Text>
                    <Text fz="sm">
                      {signerObj.signerEmail}
                    </Text>
                  </Flex>
                </Flex>
              );
            })
          }
        </Flex>

        <Accordion w="100%" variant="filled" chevron={null}>
          <Accordion.Item key="first" value="first">
            <Accordion.Control icon="+">
              <Flex
                w="100%"
                direction="column"
                align="center"
                gap="sm"
              >
                <Text c="gray.5" fz="sm">
                  Add New Signer
                </Text>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <Flex
                w="100%"
                direction="column"
                align="center"
                gap="md"
              >
                <Flex
                  w="100%"
                  direction="column"
                  align="center"
                  gap="xs"
                >
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
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddSigner}
                >
                  Add
                </Button>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

      </Flex>
    </>
  );
};