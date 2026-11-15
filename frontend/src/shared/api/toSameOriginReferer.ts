import { getSiteUrl } from "@/shared/config/siteUrl";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * API > 같은 출처의 Referer 조회
 *
 * - Referer가 SITE_URL의 출처와 같을 때만 값 반환
 * - 없거나 주소가 아니거나 다른 출처이면 null 반환
 */
export function toSameOriginReferer(request: Request): Nullable<string> {
	const referer = request.headers.get("referer");

	if (referer === null || !URL.canParse(referer)) {
		return null;
	}

	if (new URL(referer).origin !== new URL(getSiteUrl()).origin) {
		return null;
	}

	return referer;
}
