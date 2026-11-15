import { isMockEnabled } from "@/shared/lib/mock/isMockEnabled";

interface ResolveMockSettingParams<Value extends string> {
	cookieValue: string | undefined;
	envValue: string | undefined;
	values: readonly Value[];
}

/**
 * 목업 > 설정 값 결정
 *
 * - 운영 빌드이면 undefined 반환
 * - 쿠키 값이 허용 목록에 있으면 쿠키 값 반환
 * - 아니면 환경 변수 값이 허용 목록에 있을 때 그 값 반환
 * - 둘 다 없으면 undefined 반환
 */
export function resolveMockSetting<Value extends string>({
	cookieValue,
	envValue,
	values,
}: ResolveMockSettingParams<Value>): Value | undefined {
	if (!isMockEnabled()) {
		return undefined;
	}

	const fromCookie = values.find((value) => value === cookieValue);

	if (fromCookie !== undefined) {
		return fromCookie;
	}

	return values.find((value) => value === envValue);
}
