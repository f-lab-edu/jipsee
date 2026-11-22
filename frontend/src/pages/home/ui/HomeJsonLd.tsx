import { getSiteUrl } from "@/shared/config/siteUrl";
import { toWebSiteJsonLd } from "@/shared/lib/metadata/toWebSiteJsonLd";

/**
 * 홈 > JSON-LD
 *
 * - 웹사이트와 검색 동작 구조화 데이터를 script로 한 번 출력
 * - `<`를 이스케이프해 script 태그가 닫히지 않게 함
 */
export default function HomeJsonLd() {
	const json = JSON.stringify(toWebSiteJsonLd(getSiteUrl())).replace(
		/</g,
		"\\u003c",
	);

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify 결과에서 <를 이스케이프한 고정 구조화 데이터
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
