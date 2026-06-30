import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { exploringBoundariesConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "Exploring Boundaries",
  description: exploringBoundariesConfig.description
};

export default function ExploringBoundariesPage() {
  return <ReflectionWorkbookApp config={exploringBoundariesConfig} />;
}
