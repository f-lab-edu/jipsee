import { cookies } from "next/headers";
import { isMockEnabled } from "@/shared/lib/mock/isMockEnabled";
import { resolveMockSetting } from "@/shared/lib/mock/resolveMockSetting";

interface ReadMockSettingParams<Value extends string> {
	cookieName: string;
	envValue: string | undefined;
	values: readonly Value[];
}

/**
 * 목업 > 요청별 설정 값 조회
 *
 * - 운영 빌드이면 쿠키를 읽지 않고 undefined 반환
 * - 쿠키가 환경 변수보다 앞서므로 개발 서버 하나로 요청마다 다른 값을 쓸 수 있음
 */
export async function readMockSetting<Value extends string>({
	cookieName,
	envValue,
	values,
}: ReadMockSettingParams<Value>): Promise<Value | undefined> {
	if (!isMockEnabled()) {
		return undefined;
	}

	const store = await cookies();

	return resolveMockSetting({
		cookieValue: store.get(cookieName)?.value,
		envValue,
		values,
	});
}
