import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

const idPattern = /^[1-9]\d*$/;

/**
 * 채팅 > 번호 변환
 *
 * - 양의 정수 문자열이면 숫자 반환
 * - 그 밖의 값(문자열이 아닌 값 포함)이면 null 반환
 */
export function toPositiveId(
	value: string | string[] | undefined,
): Nullable<number> {
	if (typeof value !== "string" || !idPattern.test(value)) {
		return null;
	}

	return Number(value);
}
