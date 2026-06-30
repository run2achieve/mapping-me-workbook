import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { discoveringMyValuesConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "Discovering My Values",
  description: discoveringMyValuesConfig.description
};

export default function DiscoveringMyValuesPage() {
  return <ReflectionWorkbookApp config={discoveringMyValuesConfig} />;
}
