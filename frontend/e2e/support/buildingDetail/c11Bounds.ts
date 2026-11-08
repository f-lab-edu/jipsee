import type { C11Measure } from "./c11Measure";

/** 섹션 안쪽 왼쪽 끝과 오른쪽 끝. 모바일은 padding 16, 데스크톱은 border 1 + padding 32 */
export function c11Bounds(m: C11Measure, layout: "mobile" | "desktop") {
	return layout === "mobile"
		? { l: m.section.x + 16, r: m.section.r - 16 }
		: { l: m.section.x + 1 + 32, r: m.section.r - 1 - 32 };
}
