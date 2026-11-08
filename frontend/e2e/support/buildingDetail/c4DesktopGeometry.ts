import { ASIDE_X } from "./asideX";
import { ASIDE_W, ASK_CARD_BLOCK } from "./c4Layout";
import type { InfoMeasure } from "./measureInfo";

/** 데스크톱 기준값 (설계 2절, 6절): aside 380 열의 카드 padding 24, border 1, 간격 14. 1440 뷰포트의 컨테이너 안쪽은 144에서 1296까지임 */
export function c4DesktopGeometry(m: InfoMeasure) {
	const asideTop = (m.headerBottom ?? Number.NaN) + 28 + 44 + 24;
	const secY = asideTop + ASK_CARD_BLOCK;
	const h2Y = secY + 25;
	return {
		asideTop,
		secY,
		h2Y,
		cardX: ASIDE_X + 25,
		cardW: ASIDE_W - 50,
		firstCardY: h2Y + 24 + 14,
		gap: 14,
		titleFs: "15px",
	};
}
