import {
	C10_LABELS,
	C10_NAMES,
	C10_OPTIONS,
	type C10Cond,
} from "./c10Fixtures";
import type { C10Measure } from "./c10MeasureNearby";
import type { T } from "./makeT";

/** 필터 골격: 제목, 그룹 라벨, 선택 상자의 이름과 지금 값 문구와 화살표. 2026-11-09 피드백 9번 */
export function c10CheckFilterContent(
	t: T,
	m: C10Measure,
	cond: C10Cond,
	label: string,
) {
	t.eq(`${label} 보이는 제목 개수`, m.visibleTitles, 1);
	t.eq(`${label} 제목 문구`, m.title?.text, "주변 전월세 거래");
	t.eq(`${label} 그룹 개수`, m.groups?.length, 3);
	C10_NAMES.forEach((name, gi) => {
		const g = m.groups?.[gi];
		const current = C10_OPTIONS[name].find(([, value]) => value === cond[name]);
		t.eq(
			`${label} ${C10_LABELS[name]} 그룹 라벨 글자`,
			g?.labelText,
			C10_LABELS[name],
		);
		t.ok(
			`${label} ${C10_LABELS[name]} 선택 상자가 하나`,
			!!g?.trigger,
			g?.trigger,
			"있음",
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 선택 상자가 지금 값을 보여 줌`,
			g?.trigger?.text,
			current?.[0],
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 선택 상자 이름이 그룹 라벨을 가리킴`,
			g?.trigger?.labelledBy,
			g?.labelledBy,
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 선택 상자가 닫혀 있음`,
			g?.trigger?.expanded,
			"false",
		);
		t.ok(
			`${label} ${C10_LABELS[name]} 선택 상자에 화살표 아이콘`,
			!!g?.trigger?.hasChevron,
			g?.trigger?.hasChevron,
			"true",
		);
	});
}
