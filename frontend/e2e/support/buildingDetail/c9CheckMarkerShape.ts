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
	t.near(
		`${label} 바깥 지름`,
		m.outer,
		expectOuter ?? (kind === "similar" || kind === "previous" ? d + 8 : d),
		0.6,
	);
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
	} else if (kind === "similar") {
		t.eq(`${label} 도형 개수`, sh.length, 3);
		const rings: [number, string][] = [
			[d / 2 + 4, color],
			[d / 2 + 2, layer],
			[d / 2, color],
		];
		rings.forEach(([r, fill], i) => {
			const ring = sh[i];
			if (!ring) return;
			t.eq(`${label} 고리 ${i} 도형`, ring.tag, "circle");
			t.near(`${label} 고리 ${i} 반지름`, ring.r, r, 0.1);
			t.color(`${label} 고리 ${i} 채움`, ring.fill, fill);
			t.eq(`${label} 고리 ${i} 테두리 없음`, ring.sw, 0);
		});
	} else if (kind === "previous") {
		t.eq(`${label} 도형 개수`, sh.length, 2);
		const ring = sh[1];
		if (first) {
			t.near(`${label} 채운 원 반지름`, first.r, d / 2, 0.1);
			t.color(`${label} 채운 원 채움`, first.fill, color);
		}
		if (ring) {
			t.near(
				`${label} 점 고리 반지름(바깥 4, 안쪽 2 사이 중심 3)`,
				ring.r,
				d / 2 + 3,
				0.1,
			);
			t.near(`${label} 점 고리 굵기`, ring.sw, 2, 0.1);
			t.eq(`${label} 점 고리 채움 없음`, ring.fill, "none");
			t.color(`${label} 점 고리 색`, ring.stroke, color);
			t.ok(
				`${label} 점 고리 점선`,
				ring.dash !== "none",
				ring.dash,
				"dasharray 있음",
			);
			t.eq(`${label} 점 고리 끝 모양`, ring.cap, "round");
		}
	}
}
