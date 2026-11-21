import { getSiteUrl } from "@/shared/config/siteUrl";
import { toLlmsText } from "@/shared/lib/metadata/toLlmsText";

export const dynamic = "force-static";

/** llms.txt */
export function GET() {
	return new Response(toLlmsText(getSiteUrl()), {
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
}
