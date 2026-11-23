// S2 건물 상세 C9 거래 이력: 마커 종류, 범례
// 기대값 출처: 설계 3절(범례 문구), 5절(마커별 모양), 7절(색), 캔버스 보드 S2(Mobile|Desktop)(Default|NoLoc)와 DarkS2... 보드의 측정값
// 캔버스가 마커 종류를 CSS로 그리는 방식: 갱신은 배경색 원에 3px 실선 테두리, 해제는 배경색 원에 2px 점선 테두리
// 점선의 간격은 브라우저가 그리는 방식이라 숫자로 비교하지 않고 눈으로 봄(dasharray가 있는지만 설계 5절대로 확인함)
// 알려진 차이(결정): 데스크톱 카드 border로 안쪽 폭이 2px 좁고, 캔버스 그래프 상자는 border-bottom 때문에 161/221이고 앱은 160/220이며

import {
	C8_COLORS,
	C8_DEALS,
	C8_ID_LIST,
	C8_SET,
	type ChartDeal,
} from "../support/buildingDetail/c8Fixtures";
import { c8FullChart } from "../support/buildingDetail/c8FullChart";
import { c9CheckLegend } from "../support/buildingDetail/c9CheckLegend";
import { c9CheckMarkerShape } from "../support/buildingDetail/c9CheckMarkerShape";
import {
	C9_KINDS,
	C9_LAYOUT,
	type MarkerKind,
} from "../support/buildingDetail/c9Constants";
import { measureChart } from "../support/buildingDetail/measureChart";
import type { Theme } from "../support/buildingDetail/tokens";
import { buildingPath } from "../support/buildingId";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

const LAYOUTS = [
	["모바일", MOBILE, "mobile"],
	["데스크톱", DESKTOP, "desktop"],
] as const;

const N = C8_ID_LIST.length;

function dealsOf(id: number): ChartDeal[] {
	return C8_DEALS[C8_SET[id] ?? ""] ?? [];
}
function kindsOf(id: number): MarkerKind[] {
	return C9_KINDS[C8_SET[id] ?? ""] ?? [];
}

// 그래프 마커 종류와 모양, 색
for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${vp.width}x${vp.height} ${theme}`, () => {
			test.use({ viewport: vp, colorScheme: theme });

			for (const [idIndex, id] of C8_ID_LIST.entries()) {
				const deals = dealsOf(id);
				const kinds = kindsOf(id);
				test(`${caseId("C9", 1 + layoutIndex * 2 * N + themeIndex * N + idIndex)} ${name} ${theme} id ${id}의 마커 종류(${kinds.join(", ")}), 고리 모양, 색, 바깥 지름이 캔버스와 같음`, async ({
					t,
				}) => {
					await t.goto(buildingPath(id));
					const m = await t.page.evaluate(measureChart);
					t.ok("그래프가 있음", m.found, m.found, "있음");
					const full = c8FullChart(t, m);
					if (!full) return;
					const L = C9_LAYOUT[layout];
					t.eq("점 개수", full.points.length, deals.length);
					deals.forEach((p, i) => {
						const a = full.points[i];
						const kind = kinds[i];
						if (!a || !kind) return;
						const color = C8_COLORS[theme][p.kind];
						c9CheckMarkerShape(
							t,
							`점 ${i}(${kind})`,
							a,
							kind,
							p.kind,
							L.d,
							color,
							theme,
						);
					});
				});
			}
		});
	}
}
// id 2와 5는 id 1과 같은 거래 상수(캔버스 B.default)라 마커 종류도 같음
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C9-13 모바일 id 2와 5의 마커 종류가 id 1과 같음(기본, 해제, 갱신, 기본, 기본, 기본)", async ({
		t,
	}) => {
		for (const id of [2, 5]) {
			await t.goto(buildingPath(id));
			const m = await t.page.evaluate(measureChart);
			t.eq(`id ${id} 점 개수`, m.points?.length, 6);
			(C8_DEALS.default ?? []).forEach((p, i) => {
				const a = m.points?.[i];
				const kind = C9_KINDS.default?.[i];
				if (a && kind) {
					c9CheckMarkerShape(
						t,
						`id ${id} 점 ${i}`,
						a,
						kind,
						p.kind,
						C9_LAYOUT.mobile.d,
						C8_COLORS.light[p.kind],
						"light",
					);
				}
			});
		}
	});
});

// 범례: 문구, 순서, 위치, 마커 크기와 모양, 색, 간격
for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		for (const [idIndex, id] of C8_ID_LIST.entries()) {
			test(`${caseId("C9", 14 + layoutIndex * (N + 1) + idIndex)} ${name} id ${id}의 범례 항목 네 개와 보조 문구의 문구, 순서, 위치, 마커, 색이 캔버스와 같음`, async ({
				t,
			}) => {
				await t.goto(buildingPath(id));
				const m = await t.page.evaluate(measureChart);
				t.ok("그래프가 있음", m.found, m.found, "있음");
				const full = c8FullChart(t, m);
				if (full) c9CheckLegend(t, full, layout, "light");
			});
		}
	});
	test.describe(`${vp.width}x${vp.height} dark`, () => {
		test.use({ viewport: vp, colorScheme: "dark" });

		test(`${caseId("C9", 14 + layoutIndex * (N + 1) + N)} ${name} 다크 id 1의 범례 글자, 마커 색, 마커 안쪽 채움이 다크 캔버스와 같음`, async ({
			t,
		}) => {
			await t.goto(buildingPath(1));
			const m = await t.page.evaluate(measureChart);
			t.ok("그래프가 있음", m.found, m.found, "있음");
			const full = c8FullChart(t, m);
			if (full) c9CheckLegend(t, full, layout, "dark");
		});
	});
}
// 범례는 두 레이아웃 DOM에 하나씩 있고 보이는 것은 하나이며 1279와 1280 경계에서 마커 지름이 바뀜
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C9-22 범례는 DOM에 두 개, 보이는 것은 하나임", async ({ t }) => {
		await t.goto(buildingPath(1));
		const m = await t.page.evaluate(measureChart);
		t.eq("DOM 안 보조 문구 개수", m.legendDomCount, 2);
		t.eq("보이는 보조 문구 개수", m.legendVisibleCount, 1);
	});
});
for (const [index, [w, layout]] of (
	[
		[1279, "mobile"],
		[1280, "desktop"],
	] as const
).entries()) {
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C9", 23 + index)} ${w}px에서 범례 마커 지름이 ${C9_LAYOUT[layout].legendD}이고 그래프 마커 지름이 ${C9_LAYOUT[layout].d}임`, async ({
			t,
		}) => {
			await t.goto(buildingPath(1));
			const m = await t.page.evaluate(measureChart);
			const L = C9_LAYOUT[layout];
			t.eq("보이는 보조 문구 개수", m.legendVisibleCount, 1);
			t.near("범례 마커 폭", m.legend?.items[0]?.marker?.w, L.legendD, 0.5);
			t.near("그래프 첫 마커 안쪽 점 지름", m.points?.[0]?.core, L.d, 0.5);
			t.eq("보조 문구와 항목 수", m.legend?.items.length, 5);
		});
	});
}
// 거래 이력 섹션 안 절대 위치: 제목 위쪽 기준으로 범례, 그래프 상자, x 연도 줄, 다음 목록 첫 글자, 섹션 아래 끝이 캔버스와 같음 (범례가 생겨 아래 요소가 밀림)
for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		for (const [idIndex, id] of C8_ID_LIST.entries()) {
			test(`${caseId("C9", 25 + layoutIndex * N + idIndex)} ${name} id ${id}에서 제목 기준 범례, 그래프, x 연도 줄, 첫 목록 글자, 섹션 아래 끝의 세로 위치가 캔버스와 같음`, async ({
				t,
			}) => {
				await t.goto(buildingPath(id));
				const m = await t.page.evaluate(measureChart);
				t.ok("그래프가 있음", m.found, m.found, "있음");
				const full = c8FullChart(t, m);
				if (!full) return;
				const L = C9_LAYOUT[layout];
				t.eq("거래 이력 제목", full.h2Text, "거래 이력");
				t.near(
					"범례 위쪽(제목 위쪽 기준)",
					full.legend.y - full.h2Top,
					L.legendTop,
					1,
				);
				t.near(
					"그래프 상자 위쪽(제목 위쪽 기준)",
					full.boxTop - full.h2Top,
					L.boxTop,
					1,
				);
				t.near(
					"x 연도 줄 아래 끝(제목 위쪽 기준)",
					full.xRowBottom - full.h2Top,
					L.xRowBottom,
					1.5,
				);
				let nextText = "2026.08";
				if (id === 4) nextText = "2026.03";
				t.eq("다음 글자", full.dateAfter?.text, nextText);
				t.near(
					"다음 글자 위쪽(제목 위쪽 기준)",
					full.dateAfter ? full.dateAfter.y - full.h2Top : Number.NaN,
					L.firstDate[id],
					1.5,
				);
				t.near(
					"섹션 아래 끝(제목 위쪽 기준)",
					full.sectionBottom - full.h2Top,
					L.sectionBottom[id],
					1.5,
				);
			});
		}
	});
}

// 320px: 범례가 줄바꿈되어 가로 스크롤이 없고 모든 항목이 화면 안에 들어옴
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C9-38 320px에서 id 1, 4의 범례 항목이 모두 화면 안에 있고 가로 스크롤이 없음", async ({
		t,
	}) => {
		for (const id of [1, 4]) {
			await t.goto(buildingPath(id));
			const m = await t.page.evaluate(measureChart);
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.eq(`id ${id} 범례 항목 수`, m.legend?.items.length, 5);
			for (const it of m.legend?.items ?? []) {
				t.ok(
					`id ${id} "${it.text}" 오른쪽 끝이 화면 안`,
					it.right <= m.vw - 16 + 1,
					it.right,
					`≤ ${m.vw - 16}`,
				);
			}
		}
	});
});
