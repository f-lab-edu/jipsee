import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/siteUrl";
import { paths } from "@/shared/routes/paths";

const aiCrawlers = ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot"];

/**
 * robots.txt
 *
 * - 모든 크롤러와 AI 크롤러에 전체 경로 허용
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/" },
			{ userAgent: aiCrawlers, allow: "/" },
		],
		sitemap: new URL(paths.sitemap, getSiteUrl()).toString(),
	};
}
