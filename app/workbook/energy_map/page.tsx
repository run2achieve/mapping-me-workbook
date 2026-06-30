import type { Metadata } from "next";
import { WorkbookApp } from "@/components/WorkbookApp";

export const metadata: Metadata = {
  title: "Energy Map",
  description: "Record daily energy patterns and map what gives or uses energy."
};

export default function WorkbookPage() {
  return <WorkbookApp />;
}
