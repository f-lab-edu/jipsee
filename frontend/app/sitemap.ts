import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/siteUrl";
import { paths } from "@/shared/routes/paths";

/**
 * sitemap.xml
 *
 * - 정적 페이지(홈, 데이터 출처)만 포함
 * - 건물 목록 엔드포인트가 없어 건물 상세는 포함하지 않음
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();

	return [paths.home, paths.dataSources].map((path) => ({
		url: new URL(path, siteUrl).toString(),
	}));
}
