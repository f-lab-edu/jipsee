import { siteMetadata } from "@/shared/config/siteMetadata";
import { paths } from "@/shared/routes/paths";

const searchTermPlaceholder = "search_term_string";

/**
 * 메타데이터 > 웹사이트 JSON-LD 변환
 *
 * - 사이트 이름, 설명, 홈 주소는 절대 주소(siteUrl 기준)
 * - 검색 동작(SearchAction)의 urlTemplate는 검색어 자리에 {search_term_string}을 인코딩 없이 사용
 */
export function toWebSiteJsonLd(siteUrl: string) {
	const searchUrl = new URL(paths.searchWithKeyword(""), siteUrl).toString();

	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteMetadata.name,
		url: new URL(paths.home, siteUrl).toString(),
		description: siteMetadata.description,
		inLanguage: "ko",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${searchUrl}{${searchTermPlaceholder}}`,
			},
			"query-input": `required name=${searchTermPlaceholder}`,
		},
	};
}
