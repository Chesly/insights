import { getSiteSetting } from "@/lib/settings";
import { parseRawHtmlTags } from "@/lib/parseRawHtmlTags";

export default async function CustomHeadCode() {
  const code = await getSiteSetting("custom_head_code");
  if (!code || !code.trim()) return null;
  return <>{parseRawHtmlTags(code)}</>;
}
