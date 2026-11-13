import type { C10Measure } from "./c10MeasureNearby";
import type { T } from "./makeT";

/** 선택 상자 모양과 배치: 높이와 글자 크기(Seed responsive), 라벨과 선택 상자 간격 8, 라벨 세로 가운데. 2026-11-09 피드백 9번 */
export function c10CheckTriggerLayout(
	t: T,
	m: C10Measure,
	layout: "mobile" | "desktop",
	label: string,
) {
	const height = layout === "mobile" ? 52 : 40;
	const fontSize = layout === "mobile" ? "16px" : "14px";
	(m.groups ?? []).forEach((g) => {
		const tr = g.trigger;
		t.near(
			`${label} ${g.labelText} 선택 상자 높이 ${height}`,
			tr?.rect.h,
			height,
			0.5,
		);
		t.eq(
			`${label} ${g.labelText} 선택 상자 글자 크기 ${fontSize}`,
			tr?.fs,
			fontSize,
		);
		t.near(
			`${label} ${g.labelText} 라벨 오른쪽(칸 끝)과 선택 상자 간격 8`,
			(tr?.rect.x ?? Number.NaN) -
				((g.label?.rect.x ?? Number.NaN) + (g.label?.cellW ?? Number.NaN)),
			8,
			1,
		);
		t.near(
			`${label} ${g.labelText} 라벨 글자 세로 가운데`,
			(g.label?.rect.y ?? Number.NaN) + (g.label?.rect.h ?? Number.NaN) / 2,
			g.rect.y + g.rect.h / 2,
			1.5,
		);
		t.near(`${label} ${g.labelText} 그룹 높이 ${height}`, g.rect.h, height, 1);
	});
}
