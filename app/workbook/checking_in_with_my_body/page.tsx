import type { Metadata } from "next";
import { ReflectionWorkbookApp } from "@/components/ReflectionWorkbookApp";
import { checkingInWithMyBodyConfig } from "@/components/reflection-workbooks";

export const metadata: Metadata = {
  title: "Checking-In With My Body",
  description: checkingInWithMyBodyConfig.description
};

export default function CheckingInWithMyBodyPage() {
  return <ReflectionWorkbookApp config={checkingInWithMyBodyConfig} />;
}
