import { MOBILE_TITLE_HEIGHT } from "../viewports";
import type { InfoMeasure } from "./measureInfo";

/** 모바일 기준값 (설계 2절 주요 간격): 섹션 padding 위 20, 좌우 16, 아래 24, 간격 12, 제목과 주소 간격 2. 카드 border 1과 건물명 제목 블록 44가 섹션 위에 있음 */
export function c4MobileGeometry(
	m: InfoMeasure,
	id: number,
	colX: number,
	colW: number,
) {
	const hasAddress = id !== 4;
	const h2Y = (m.headerBottom ?? Number.NaN) + MOBILE_TITLE_HEIGHT + 20;
	const headingH = 24 + (hasAddress ? 2 + 20 : 0);
	return {
		hasAddress,
		colX,
		colW,
		h2Y,
		headingH,
		cardX: colX + 16,
		cardW: colW - 32,
		firstCardY: h2Y + headingH + 12,
		gap: 12,
		titleFs: "16px",
	};
}
