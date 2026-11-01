/** 검색 파라미터가 문자열이면 앞뒤 공백을 뺀 값을, 아니면 빈 문자열을 반환함 */
export function toKeyword(value: string | string[] | undefined): string {
	if (typeof value === "string") {
		return value.trim();
	}

	return "";
}
