const tokenPattern = /^t\d+$/;

/** 글자 토큰(t9 등)은 Seed CSS 변수로, 그 밖의 값(34px 등)은 그대로 반환 */
export function toTypographyValue(
	value: string,
	property: "font-size" | "line-height",
) {
	if (tokenPattern.test(value)) {
		return `var(--seed-${property}-${value})`;
	}
	return value;
}
