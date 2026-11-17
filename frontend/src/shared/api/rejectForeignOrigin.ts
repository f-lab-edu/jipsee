import { getSiteUrl } from "@/shared/config/siteUrl";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * API > 다른 출처 요청 거부
 *
 * - 요청의 Origin이 SITE_URL의 출처와 다르거나 없으면 403 응답 반환
 * - 같으면 null 반환
 * - 프록시 뒤에서는 요청 주소가 내부 주소이므로 요청 주소와 비교하지 않음
 */
export function rejectForeignOrigin(request: Request): Nullable<Response> {
	if (request.headers.get("origin") === new URL(getSiteUrl()).origin) {
		return null;
	}
	return new Response("요청 출처가 이 사이트와 달라 거부함", { status: 403 });
}
