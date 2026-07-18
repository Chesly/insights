import { getSiteSetting } from "@/lib/settings";
import InjectHTML from "./InjectHTML";

export default async function CustomFooterCode() {
  const code = await getSiteSetting("custom_footer_code");
  if (!code) return null;
  return <InjectHTML html={code} target="body-end" />;
}
