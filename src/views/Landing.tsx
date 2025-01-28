import { Flex } from "@mantine/core";

export default function Landing() {
  return (
    <Flex w="100%" direction="column" align="center" gap="sm">
      Versee: Simplifying Application Processes with AI
      <br />
      <br />
      Versee is a web app designed to make reviewing and submitting complex applications, like affordable housing schemes, simple and user-friendly. Reviewing agreements and understanding eligibility criteria can be overwhelming, especially when dealing with multiple documents and hidden requirements. Versee uses advanced language models (LLMs) to analyze documents, extract relevant information, and guide you through the process step-by-step. This ensures that you no longer need to rely on third parties or share sensitive documents with strangers to determine your eligibility.
      <br /><br />
      With Versee, you can easily upload files, whether they’re PDFs or even photos converted into PDFs. The app analyzes these documents, identifies their type, and extracts key details to assess your eligibility against specific criteria, like income limits. For example, in the case of an affordable housing scheme in Navi Mumbai, Versee scans your tax records to verify your income level, saving you time and effort. The app also provides an interactive interface to track your application status, reduces ineligible applications, and ensures a smoother experience with features like QR code scanning and document signing through DocuSign. Versee transforms tedious manual processes into efficient, AI-driven workflows, empowering you to make informed decisions with ease.
    </Flex>
  );
}
