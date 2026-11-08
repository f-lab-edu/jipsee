import type { C12State } from "./c12Fixtures";
import type { T } from "./makeT";
import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 섹션 크기: 캔버스 높이와 위쪽 좌표 */
export function c12CheckSection(
	t: T,
	m: NearbyDealsMeasure,
	layout: "mobile" | "desktop",
	st: C12State,
	label: string,
) {
	const mobile = layout === "mobile";
	const secH = mobile ? st.secM : st.secD;
	const y = mobile ? st.yM : st.yD;
	t.near(
		`${label} 섹션 높이(캔버스 ${mobile ? "" : "+ 카드 테두리 2 "}${secH})`,
		m.section?.h,
		secH,
		0.5,
	);
	t.near(`${label} 섹션 위쪽 y(캔버스 ${y})`, m.section?.y, y, 1.5);
}
