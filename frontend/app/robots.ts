import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/siteUrl";
import { paths } from "@/shared/routes/paths";

/** robots.txt */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/" },
		sitemap: new URL(paths.sitemap, getSiteUrl()).toString(),
	};
}
