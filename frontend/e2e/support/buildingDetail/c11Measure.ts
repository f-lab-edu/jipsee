import type { T } from "./makeT";
import {
	measureNearbyDeals,
	type NearbyDealsMeasure,
} from "./measureNearbyDeals";

/** 섹션이 보일 때 채워지는 필드가 모두 있는 측정 결과 */
export type C11Measure = NearbyDealsMeasure &
	Required<
		Pick<
			NearbyDealsMeasure,
			| "section"
			| "summary"
			| "ul"
			| "tables"
			| "tableLabel"
			| "lis"
			| "header"
			| "trs"
			| "list"
			| "notes"
		>
	>;

/** 원본 c11Measure. 섹션이 보이지 않으면 원본도 이어지는 접근에서 실패하므로 바로 던짐 */
export async function c11Measure(t: T): Promise<C11Measure> {
	const m = await t.page.evaluate(measureNearbyDeals);
	if (
		!m.found ||
		!m.section ||
		m.summary === undefined ||
		m.ul === undefined ||
		m.tables === undefined ||
		m.tableLabel === undefined ||
		!m.lis ||
		m.header === undefined ||
		!m.trs ||
		m.list === undefined ||
		!m.notes
	) {
		throw new Error("주변 전월세 거래 섹션이 보이지 않음");
	}
	return {
		...m,
		section: m.section,
		summary: m.summary,
		ul: m.ul,
		tables: m.tables,
		tableLabel: m.tableLabel,
		lis: m.lis,
		header: m.header,
		trs: m.trs,
		list: m.list,
		notes: m.notes,
	};
}
