import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { exploringIdentityBeliefsConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "Exploring Identity & Beliefs",
  description: exploringIdentityBeliefsConfig.description
};

export default function ExploringIdentityBeliefsPage() {
  return <ReflectionWorkbookApp config={exploringIdentityBeliefsConfig} />;
}
