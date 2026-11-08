import { C10_CHIPS, C10_LABELS, C10_NAMES, type C10Cond } from "./c10Fixtures";
import type { C10Measure } from "./c10MeasureNearby";
import { c10NearbyHref } from "./c10NearbyHref";
import type { T } from "./makeT";

/** 필터 골격: 제목, 그룹 라벨과 칩 문구와 순서, 선택, href, aria-current */
export function c10CheckFilterContent(
	t: T,
	m: C10Measure,
	id: number,
	cond: C10Cond,
	label: string,
) {
	t.eq(`${label} 보이는 제목 개수`, m.visibleTitles, 1);
	t.eq(`${label} 제목 문구`, m.title?.text, "주변 전월세 거래");
	t.eq(`${label} 그룹 개수`, m.groups?.length, 3);
	C10_NAMES.forEach((name, gi) => {
		const g = m.groups?.[gi];
		t.eq(
			`${label} ${C10_LABELS[name]} 그룹 라벨 글자`,
			g?.labelText,
			C10_LABELS[name],
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 칩 문구와 순서`,
			g?.chips.map((c) => c.text),
			C10_CHIPS[name].map(([text]) => text),
		);
		C10_CHIPS[name].forEach(([text, value], ci) => {
			const c = g?.chips[ci];
			const selected = cond[name] === value;
			t.eq(`${label} ${text} aria-current`, c?.cur, selected ? "true" : null);
			t.eq(
				`${label} ${text} href(다른 조건 유지, 이 항목만 변경)`,
				c?.href,
				c10NearbyHref(id, cond, { [name]: value }),
			);
		});
		t.eq(
			`${label} ${C10_LABELS[name]} 그룹의 aria-current 개수`,
			g?.chips.filter((c) => c.cur !== null).length,
			1,
		);
	});
}
