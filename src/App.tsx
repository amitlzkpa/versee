import '@mantine/core/styles.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  AppShell,
  Button,
  Burger,
  Container,
  Group,
  MantineProvider,
  createTheme,
  rem,
} from '@mantine/core';
import { FaInfoCircle } from 'react-icons/fa';
import { useDisclosure } from '@mantine/hooks';

import Dev from "./views/Dev";
import Landing from "./views/Landing";

function App() {

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

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
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Button
              component="a"
              variant="outline"
              href="/"
              radius="xl"
              size="md"
              pr="2rem"
              h={48}
            >
              <img src="/logo-512x512.png" alt="Versee" style={{ height: "3rem" }} />
              Versee
              <FaInfoCircle />
            </Button>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar pl="md" py="md">
          Navbar
        </AppShell.Navbar>

        <AppShell.Main>
          <Container size="60rem">
            <RouterProvider router={router} />
          </Container>
        </AppShell.Main>

      </AppShell>
    </MantineProvider>
  )
};

export default App;
