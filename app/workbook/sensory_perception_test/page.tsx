import { SensoryPerceptionTestApp } from "@/components/SensoryPerceptionTestApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sensory Perception Quotient | Mapping Me",
  description: "A local-first SPQ sensory perception assessment."
};

export default function SensoryPerceptionTestPage() {
  return <SensoryPerceptionTestApp />;
}
