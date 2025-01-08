import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import {
  Flex,
  MantineProvider,
  createTheme,
  rem,
} from '@mantine/core';

import Dev from "./views/Dev";
import OauthCallback_Docusign from "./views/OauthCallback_Docusign";
import Landing from "./views/Landing";

import Navbar from "./components/Navbar";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(CONVEX_URL);

function App() {

  const theme = createTheme({
    fontFamily: 'Nunito, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
      fontWeight: '800',
      fontFamily: 'Bitter',
      sizes: {
        h1: { fontSize: rem(38), lineHeight: '0.9' },
        h2: { fontSize: rem(34), lineHeight: '0.9' },
        h3: { fontSize: rem(30), lineHeight: '0.9' },
        h4: { fontSize: rem(26), lineHeight: '0.9' },
        h5: { fontSize: rem(22), lineHeight: '0.9' },
        h6: { fontSize: rem(18), lineHeight: '0.9' },
      },
    },
    fontSizes: {
      xs: rem(16),
      sm: rem(17),
      md: rem(20),
      lg: rem(22),
      xl: rem(26),
    },
    lineHeights: {
      xs: '1.6',
      sm: '1.65',
      md: '1.75',
      lg: '1.8',
      xl: '1.85',
    },
    defaultRadius: 'xl',
    primaryColor: 'versee-purple',
    colors: {
      'versee-purple': [
        "#f3edff",
        "#e1d7fb",
        "#beabf0",
        "#9a7de7",
        "#7c56de",
        "#693dd9",
        "#5f30d8",
        "#4f23c0",
        "#461eac",
        "#3b1898"
      ],
    },

  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/dev",
      element: <Dev />,
    },
    {
      path: "/callback/docusign",
      element: <OauthCallback_Docusign />,
    },
  ]);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <MantineProvider theme={theme}>
          <Flex
            w="100%"
            h="100%"
            direction="column"
            align="center"
            gap="sm"
          >
            <Flex w="100%" p="sm">
              <Navbar />
            </Flex>
            <Flex w="100%" h="100%" p="sm" style={{ overflowY: "auto" }}>
              <RouterProvider router={router} />
            </Flex>
          </Flex>
        </MantineProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
};

export default App;
