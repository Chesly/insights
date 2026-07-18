import { getSiteSetting } from "@/lib/settings";
import InjectHTML from "./InjectHTML";

export default async function CustomHeadCode() {
  const code = await getSiteSetting("custom_head_code");
  if (!code) return null;
  return <InjectHTML html={code} target="head" />;
}
