import type { MarkerKind } from "./c9Constants";
import type { T } from "./makeT";
import type { ChartMeasure } from "./measureChart";
import { type Theme, TOKENS } from "./tokens";

type MarkerLike = Pick<
	NonNullable<ChartMeasure["points"]>[number],
	"shapes" | "outer" | "core" | "color"
>;
type Shape = MarkerLike["shapes"][number];

/** 마커 도형 기대값 검사. d는 마커 지름(그래프 12|14, 범례 10|12), color는 currentColor */
export function c9CheckMarkerShape(
	t: T,
	label: string,
	m: MarkerLike,
	kind: MarkerKind,
	deal: "jeonse" | "sale",
	d: number,
	color: string,
	theme: Theme,
	expectOuter?: number,
) {
	const layer = TOKENS[theme].layerDefault;
	const sh = m.shapes;
	const sale = deal === "sale";
	t.color(`${label} 색(currentColor)`, m.color, color);
	t.near(`${label} 바깥 지름`, m.outer, expectOuter ?? d, 0.6);
	const rectOrCircle = (
		s: Shape,
		sw: number,
		fill: string,
		stroke: string | null,
		dashed: boolean,
	) => {
		if (sale) {
			t.eq(
				`${label} 마름모 도형`,
				[s.tag, s.transform],
				["rect", "rotate(45)"],
			);
			t.near(`${label} 마름모 한 변`, s.width, d - sw, 0.1);
		} else {
			t.eq(`${label} 원 도형`, s.tag, "circle");
			t.near(`${label} 원 반지름`, s.r, d / 2 - sw / 2, 0.1);
		}
		t.near(`${label} 테두리 굵기`, s.sw, sw, 0.1);
		t.color(`${label} 채움`, s.fill, fill);
		if (stroke) t.color(`${label} 테두리 색`, s.stroke, stroke);
		if (dashed) {
			t.ok(`${label} 점선`, s.dash !== "none", s.dash, "dasharray 있음");
		} else {
			t.eq(`${label} 실선`, s.dash, "none");
		}
	};
	const first = sh[0];
	if (kind === "default") {
		t.eq(`${label} 도형 개수`, sh.length, 1);
		if (first) rectOrCircle(first, 0, color, null, false);
	} else if (kind === "renewal") {
		t.eq(`${label} 도형 개수`, sh.length, 1);
		if (first) rectOrCircle(first, 3, layer, color, false);
	} else if (kind === "cancelled") {
		t.eq(`${label} 도형 개수`, sh.length, 1);
		if (first) rectOrCircle(first, 2, layer, color, true);
	}
}
