import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

const DELETE_CODE = 0x7f;
const LAST_CONTROL_CODE = 0x1f;

/**
 * 로그인 > 돌아갈 경로 검증
 *
 * - 같은 사이트 경로(`/`로 시작하고 `//`로 시작하지 않으며 `\`와 제어 문자가 없는 값)면 그대로 반환
 * - 그 밖의 값(빈 값, 값이 둘 이상인 쿼리 포함)이면 null 반환
 */
export function toSafeNext(
	raw: string | string[] | undefined,
): Nullable<string> {
	if (typeof raw !== "string") {
		return null;
	}

	if (!raw.startsWith("/") || raw.startsWith("//")) {
		return null;
	}

	for (const char of raw) {
		const code = char.charCodeAt(0);

		if (char === "\\" || code <= LAST_CONTROL_CODE || code === DELETE_CODE) {
			return null;
		}
	}

	return raw;
}
