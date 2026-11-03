/**
 * 홈 > 검색어 변환
 *
 * - 문자열이면 앞뒤 공백을 제거한 값 반환
 * - 문자열이 아니면 빈 문자열 반환
 */
export function toKeyword(value: string | string[] | undefined): string {
	if (typeof value === "string") {
		return value.trim();
	}

	return "";
}
