import { getSiteSetting } from "@/lib/settings";
import { parseRawHtmlTags } from "@/lib/parseRawHtmlTags";

export default async function CustomFooterCode() {
  const code = await getSiteSetting("custom_footer_code");
  if (!code || !code.trim()) return null;
  return <>{parseRawHtmlTags(code)}</>;
}
