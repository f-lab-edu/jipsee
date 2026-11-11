import type { T } from "./makeT";
import type { ChartMeasure } from "./measureChart";

const OPTIONAL_KEYS = [
	"role",
	"aria",
	"inDealHistory",
	"gridCols",
	"colGap",
	"box",
	"ycol",
	"xRow",
	"yLabels",
	"xLabels",
	"svg",
	"points",
	"lines",
	"band",
	"pill",
	"legendDomCount",
	"legendVisibleCount",
	"h2Top",
	"h2Text",
	"sectionBottom",
	"gridTop",
	"boxTop",
	"xRowBottom",
	"legend",
	"dateAfter",
	"firstAfter",
] as const satisfies readonly (keyof ChartMeasure)[];

/** 그래프를 찾았고 측정값이 모두 채워졌을 때만 완전한 측정값을 반환함. 찾았는데 일부가 비면 실패로 기록함 */
export function c8FullChart(
	t: T,
	m: ChartMeasure,
): Required<ChartMeasure> | null {
	if (!m.found) return null;
	if (OPTIONAL_KEYS.every((key) => m[key] !== undefined)) {
		return m as Required<ChartMeasure>;
	}
	t.fail("그래프 측정값 일부가 비어 있음");
	return null;
}
