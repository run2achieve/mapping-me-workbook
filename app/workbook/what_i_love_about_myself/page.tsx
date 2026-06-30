import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { whatILoveAboutMyselfConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "What I Love About Myself",
  description: whatILoveAboutMyselfConfig.description
};

export default function WhatILoveAboutMyselfPage() {
  return <ReflectionWorkbookApp config={whatILoveAboutMyselfConfig} />;
}
