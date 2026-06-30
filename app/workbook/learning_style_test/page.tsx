import { LearningStyleTestApp } from "@/components/LearningStyleTestApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Style Test | Mapping Me",
  description: "A local-first learning style test for self-understanding."
};

export default function LearningStyleTestPage() {
  return <LearningStyleTestApp />;
}
