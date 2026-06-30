import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { myGettingStartedToolkitConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "My Getting-Started Toolkit",
  description: myGettingStartedToolkitConfig.description
};

export default function MyGettingStartedToolkitPage() {
  return <ReflectionWorkbookApp config={myGettingStartedToolkitConfig} />;
}
