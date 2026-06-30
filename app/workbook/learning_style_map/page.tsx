import { LearningStyleMapApp } from "@/components/LearningStyleMapApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Style Map | Mapping Me",
  description: "A local-first learning style mapping workbook for self-understanding."
};

export default function LearningStyleMapPage() {
  return <LearningStyleMapApp />;
}
