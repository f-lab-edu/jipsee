import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 마지막 행 아래 끝과 섹션 아래 끝의 간격: 이전 건물 거래 같은 뒤 블록이 없는 건물(id 1, 2, 4, 5)에서만 봄 */
export function checkDealsBottom(t: T, m: DealsMeasure, pad: number) {
	const last = m.rows[m.rows.length - 1];
	t.near(
		`마지막 행 아래 끝과 섹션 아래 끝 간격 ${pad}`,
		(m.section?.rect.b ?? Number.NaN) - (last?.rect.b ?? Number.NaN),
		pad,
		1,
	);
}
