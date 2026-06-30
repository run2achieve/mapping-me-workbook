import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { processingMyEmotionsConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "Processing My Emotions",
  description: processingMyEmotionsConfig.description
};

export default function ProcessingMyEmotionsPage() {
  return <ReflectionWorkbookApp config={processingMyEmotionsConfig} />;
}
