import { Button, Flex, Loader } from "@mantine/core";
import { FaInfoCircle } from "react-icons/fa";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <Flex w="100%" h="100%" justify="space-between" align="center" gap="md">
      <Flex align="center">
        <Button component="a" href="/" variant="subtle" size="md" h={48}>
          <img
            src="/logo-512x512.png"
            alt="Versee"
            style={{ height: "2rem", margin: 8 }}
          />
          Versee
        </Button>
        <Button
          component="a"
          variant="transparent"
          href="/home"
          size="sm"
          h={32}
        >
          <FaInfoCircle color="versee-purple" />
        </Button>
        <Button component="a" variant="transparent" href="/p" size="sm" h={32}>
          <FaInfoCircle color="versee-purple" />
        </Button>
        <Button
          component="a"
          variant="transparent"
          href="/my-account"
          size="sm"
          h={32}
        >
          <FaInfoCircle color="versee-purple" />
        </Button>
        <Button
          component="a"
          variant="transparent"
          href="/dev"
          size="sm"
          h={32}
        >
          <FaInfoCircle color="versee-purple" />
        </Button>
      </Flex>

      <Flex align="center" gap="md">
        <AuthLoading>
          <Loader size="sm" />
        </AuthLoading>
        <Unauthenticated>
          <SignInButton fallbackRedirectUrl="/">
            <Button variant="outline" radius="xl" size="md" h={48}>
              Login
            </Button>
          </SignInButton>
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </Flex>
    </Flex>
  );
}
