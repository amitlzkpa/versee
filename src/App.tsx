import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { Flex, createTheme, rem } from '@mantine/core';

import Dev from "./views/Dev";
import OauthCallback_Docusign from "./views/OauthCallback_Docusign";
import Landing from "./views/Landing";
import MyAccount from "./views/MyAccount";
import Home from "./views/Home";
import Project from "./views/Project";

import Navbar from "./components/Navbar";

function App() {

  const user = useUser();

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
      path: "/home",
      element: user ? <Home /> : <Landing />,
    },
    {
      path: "/p/:projectId?",
      element: user ? <Project /> : <Landing />,
    },
    {
      path: "/my-account",
      element: user ? <MyAccount /> : <Landing />,
    },
    {
      path: "/callback/docusign",
      element: user ? <OauthCallback_Docusign /> : <Landing />,
    },
  ]);

  return (
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
  )
};

export default App;
