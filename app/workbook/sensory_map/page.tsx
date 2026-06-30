import type { Metadata } from "next";
import { SensoryMapApp } from "@/components/SensoryMapApp";

export const metadata: Metadata = {
  title: "Sensory Map",
  description: "Explore sensory systems, profile patterns, and support ideas."
};

export default function SensoryMapPage() {
  return <SensoryMapApp />;
}
