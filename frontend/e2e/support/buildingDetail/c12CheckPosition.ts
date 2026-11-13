import { c11Confirmed } from "./c11Confirmed";
import type { C12State } from "./c12Fixtures";
import { c12Notices } from "./c12Notices";
import { c12Total } from "./c12Total";
import type { T } from "./makeT";
import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 위치: 건수 줄 아래 16/20, 그 아래에 목록(없으면 확정일자 안내) 16/20 */
export function c12CheckPosition(
	t: T,
	m: NearbyDealsMeasure,
	layout: "mobile" | "desktop",
	st: C12State,
	label: string,
) {
	const gap = layout === "mobile" ? 16 : 20;
	const n = c12Notices(m)[0];
	const conf = c11Confirmed(m)[0];
	if (!n || !m.summary) {
		t.fail(`${label} 안내 또는 건수 줄이 없음`);
		return;
	}
	const nan = Number.NaN;
	const hasList = (st.count ?? 0) > 0;
	t.near(
		`${label} 건수 줄 아래에서 안내까지 ${gap}`,
		n.y - m.summary.rect.b,
		gap,
		0.5,
	);
	if (hasList) {
		t.ok(`${label} 목록이 있음`, !!m.list, m.list, "있음");
		t.near(
			`${label} 안내 아래에서 목록까지 ${gap}`,
			(m.list?.y ?? nan) - n.b,
			gap,
			0.5,
		);
	} else {
		t.eq(`${label} 목록 없음`, m.list, null);
		t.near(
			`${label} 안내 아래에서 확정일자 안내까지 ${gap}`,
			(conf?.y ?? nan) - n.b,
			gap,
			0.5,
		);
	}
	const order = [
		m.summary.rect.y,
		n.y,
		...(hasList ? [m.list?.y] : []),
		conf?.y,
	];
	t.ok(
		`${label} 순서가 건수 줄, 안내, ${hasList ? "목록, " : ""}확정일자 안내`,
		order.every((v, i) => {
			if (typeof v !== "number") return false;
			if (i === 0) return true;
			const prev = order[i - 1];
			return typeof prev === "number" && v > prev;
		}),
		order,
		"오름차순",
	);
	t.eq(`${label} 섹션 안 note 개수(조건 확장 + 확정일자)`, c12Total(m), 2);
}
