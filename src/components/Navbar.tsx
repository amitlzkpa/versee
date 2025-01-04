
import {
  Button,
  Flex,
} from '@mantine/core';
import { FaInfoCircle } from 'react-icons/fa';

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar() {

  const { user } = useUser();

  return (
    <Flex h="100%" justify="space-between" align="center" gap="md" p="md">
      <Flex align="center" gap="md">
        <Button
          component="a"
          variant="outline"
          href="/"
          radius="xl"
          size="md"
          h={48}
        >
          <img src="/logo-512x512.png" alt="Versee" style={{ height: "3rem" }} />
          Versee
        </Button>
        <Button
          component="a"
          variant="transparent"
          href="/dev"
          size="sm"
          h={32}
        >
          <FaInfoCircle color="versee-maroon" />
        </Button>
      </Flex>

      <Flex align="center" gap="md">
        <AuthLoading>
          <div>...</div>
        </AuthLoading>
        <Unauthenticated>
          <SignInButton fallbackRedirectUrl="/dashboard" />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </Flex>
    </Flex>
  );
};