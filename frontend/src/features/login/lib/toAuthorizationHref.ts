import type { Provider } from "@/entities/session/model/session";
import { loginProviders } from "@/features/login/config/loginProviders";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

/**
 * 로그인 > OAuth 시작 경로
 *
 * - next가 없으면 제공자 경로만 반환
 * - next가 있으면 한 번 인코딩해 쿼리로 붙임
 */
export function toAuthorizationHref(
	provider: Provider,
	next: Nullable<string>,
) {
	const href = paths.oauthAuthorization(loginProviders[provider].pathSegment);
	if (next === null) {
		return href;
	}

	return `${href}?next=${encodeURIComponent(next)}`;
}
