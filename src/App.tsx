import '@mantine/core/styles.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import {
  AppShell,
  MantineProvider,
  createTheme,
  rem,
} from '@mantine/core';

import Dev from "./views/Dev";
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
    primaryColor: 'versee-maroon',
    colors: {
      'versee-maroon': [
        "#ffeaec",
        "#fcd4d7",
        "#f4a7ac",
        "#ec777e",
        "#e64f57",
        "#e3353f",
        "#e22732",
        "#c91a25",
        "#b41220",
        "#9e0419"
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
  ]);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <MantineProvider theme={theme}>
          <AppShell
            padding="md"
            header={{ height: 60 }}
          >
            <AppShell.Header>
              <Navbar />
            </AppShell.Header>

            <AppShell.Main>
              <RouterProvider router={router} />
            </AppShell.Main>

          </AppShell>
        </MantineProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
};

export default App;
