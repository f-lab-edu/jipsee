// S2 건물 상세 C8 거래 이력: 점 그래프
// 기대값 출처: 설계 5절, 캔버스 보드 S2(Mobile|Desktop)(Default|NoLoc|Few)와 DarkS2... 보드의 점, 축 계산식과 측정값
// 캔버스 계산식: 끝 연도 2026, 시작 연도 min(2023, 거래 연도), 가로 비율 ((연 - 시작) * 12 + 월 - 1) / ((끝 - 시작 + 1) * 12 - 1), 세로는 금액 최솟값 - 1000과 최댓값 + 1000을 2000 단위로 내림, 올림
// 마커 종류, 범례, 이전 건물 영역은 C9 케이스에서 봄(커밋 9 반영: 점 측정을 마커 단위로 바꿈). 월세만 있는 건물은 목업에 없어 시험하지 않음
// 캔버스 점 상자는 border-bottom 1px 때문에 161/221이고 앱은 160/220임. x축 선 0.5px 차이와 데스크톱 카드 border 때문에 안쪽 폭이 2px 좁은 것은 결정이라 기대값에 반영함

import {
	C8_COLORS,
	C8_DEALS,
	C8_ID_LIST,
	C8_SET,
	type ChartDeal,
} from "../support/buildingDetail/c8Fixtures";
import { c8FullChart } from "../support/buildingDetail/c8FullChart";
import type { T } from "../support/buildingDetail/makeT";
import {
	type ChartMeasure,
	measureChart,
} from "../support/buildingDetail/measureChart";
import { type Theme, TOKENS } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_CARD } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

const C8_LAYOUT = {
	mobile: {
		h: 160,
		col: 72,
		d: 12,
		boxW: 276 - 2 * MOBILE_CARD.x,
		fs: "11px",
		lh: "14px",
		yLabelY: [-7, 66, 139],
		xLabelY: 167,
	},
	desktop: {
		h: 220,
		col: 84,
		d: 14,
		boxW: 588,
		fs: "12px",
		lh: "14px",
		yLabelY: [-8, 95, 198],
		xLabelY: 226,
	},
};

const LAYOUTS = [
	["모바일", MOBILE, "mobile"],
	["데스크톱", DESKTOP, "desktop"],
] as const;

const N = C8_ID_LIST.length;

function dealsOf(id: number): ChartDeal[] {
	return C8_DEALS[C8_SET[id] ?? ""] ?? [];
}

function c8Expect(deals: ChartDeal[]) {
	const endYear = 2026;
	const startYear = Math.min(2023, ...deals.map((d) => d.y));
	const total = (endYear - startYear + 1) * 12 - 1;
	const pct = (y: number, m: number) =>
		(((y - startYear) * 12 + m - 1) / total) * 100;
	const amts = deals.map((d) => d.amt);
	const yMin = Math.floor((Math.min(...amts) - 1000) / 2000) * 2000;
	const yMax = Math.ceil((Math.max(...amts) + 1000) / 2000) * 2000;
	const span = endYear - startYear + 1;
	let step = 3;
	if (span <= 5) step = 1;
	else if (span <= 10) step = 2;
	const ticks: { text: string; xPct: number }[] = [];
	for (let y = startYear; y <= endYear; y += step) {
		ticks.push({ text: String(y), xPct: pct(y, 1) });
	}
	const won = (n: number) => {
		const eok = Math.floor(n / 10000);
		const man = n % 10000;
		if (eok === 0) return `${man.toLocaleString("ko-KR")}만원`;
		if (man === 0) return `${eok}억`;
		return `${eok}억 ${man.toLocaleString("ko-KR")}만원`;
	};
	const jeonse = deals.filter((d) => d.kind === "jeonse").length;
	return {
		points: deals.map((d) => ({
			xPct: pct(d.y, d.m),
			yPct: ((yMax - d.amt) / (yMax - yMin)) * 100,
			kind: d.kind,
			prev: !!d.prev,
		})),
		yLabels: [won(yMax), won((yMax + yMin) / 2), won(yMin)],
		ticks,
		label: `거래 금액 점 그래프, 전세 ${jeonse}건, 매매 ${deals.length - jeonse}건${deals.some((d) => !d.prev) ? "" : ", 현재 건물 거래 없음"}`,
	};
}

function checkChartPoints(
	t: T,
	m: Required<ChartMeasure>,
	id: number,
	layout: "mobile" | "desktop",
	theme: Theme,
) {
	const L = C8_LAYOUT[layout];
	const ex = c8Expect(dealsOf(id));
	t.eq("보이는 그래프 개수", m.visibleCount, 1);
	t.eq("점 개수", m.points.length, ex.points.length);
	t.near("그래프 상자 폭", m.box.w, L.boxW, 1);
	t.near("그래프 상자 높이", m.box.h, L.h, 1);
	ex.points.forEach((p, i) => {
		const a = m.points[i];
		if (!a) return;
		t.near(`점 ${i} 중심 x`, a.cx, (p.xPct / 100) * L.boxW, 1);
		t.near(`점 ${i} 중심 y`, a.cy, (p.yPct / 100) * L.h, 1);
		const sale = p.kind === "sale";
		// 커밋 9: 마커 종류별로 도형이 여러 개이므로 안쪽 점 지름(core)과 첫 도형 모양, currentColor를 봄
		t.near(`점 ${i} 크기(안쪽 점 지름)`, a.core, L.d, 1);
		t.eq(`점 ${i} 모양`, a.shapes[0]?.tag, sale ? "rect" : "circle");
		t.color(
			`점 ${i} 색`,
			a.color,
			C8_COLORS[theme][p.prev ? "previous" : p.kind],
		);
	});
}

for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${vp.width}x${vp.height} ${theme}`, () => {
			test.use({ viewport: vp, colorScheme: theme });

			for (const [idIndex, id] of C8_ID_LIST.entries()) {
				test(`${caseId("C8", 1 + layoutIndex * 2 * N + themeIndex * N + idIndex)} ${name} ${theme} id ${id}의 점 개수, 중심 좌표, 크기, 색이 캔버스와 같음 (${dealsOf(id).length}개)`, async ({
					t,
				}) => {
					await t.goto(`/buildings/${id}`);
					const m = await t.page.evaluate(measureChart);
					t.ok("그래프가 있음", m.found, m.found, "있음");
					const full = c8FullChart(t, m);
					if (full) checkChartPoints(t, full, id, layout, theme);
				});
			}
		});
	}
}
for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		for (const [idIndex, id] of C8_ID_LIST.entries()) {
			test(`${caseId("C8", 2 * 2 * N + 1 + layoutIndex * N + idIndex)} ${name} id ${id}의 y 값 세 개와 x 연도 글자의 문구, 위치, 글자 모양이 캔버스와 같음`, async ({
				t,
			}) => {
				await t.goto(`/buildings/${id}`);
				const m = await t.page.evaluate(measureChart);
				t.ok("그래프가 있음", m.found, m.found, "있음");
				const full = c8FullChart(t, m);
				if (!full) return;
				const L = C8_LAYOUT[layout];
				const ex = c8Expect(dealsOf(id));
				t.eq(
					"y 값 문구",
					full.yLabels.map((l) => l.text),
					ex.yLabels,
				);
				full.yLabels.forEach((l, i) => {
					t.near(`y 값 ${i} 오른쪽 끝 (열 간격 10만큼 왼쪽)`, l.r, -10, 1);
					t.near(`y 값 ${i} 위쪽`, l.y, L.yLabelY[i], 1);
					t.eq(`y 값 ${i} 글자 크기와 줄 높이`, [l.fs, l.lh], [L.fs, L.lh]);
					t.eq(`y 값 ${i} 정렬`, l.ta, "right");
					t.color(
						`y 값 ${i} 색 fg.neutralMuted`,
						l.color,
						TOKENS.light.fgMuted,
					);
				});
				t.eq(
					"x 연도 문구",
					full.xLabels.map((l) => l.text),
					ex.ticks.map((k) => k.text),
				);
				full.xLabels.forEach((l, i) => {
					t.near(
						`x ${l.text} 왼쪽`,
						l.x,
						((ex.ticks[i]?.xPct ?? Number.NaN) / 100) * L.boxW,
						1,
					);
					t.near(`x ${l.text} 위쪽`, l.y, L.xLabelY, 1);
					t.eq(`x ${l.text} 글자 크기와 줄 높이`, [l.fs, l.lh], [L.fs, L.lh]);
					t.color(
						`x ${l.text} 색 fg.neutralMuted`,
						l.color,
						TOKENS.light.fgMuted,
					);
				});
			});
		}
	});
}
for (const [layoutIndex, [name, vp]] of LAYOUTS.entries()) {
	test.describe(`${vp.width}x${vp.height} dark`, () => {
		test.use({ viewport: vp, colorScheme: "dark" });

		test(`${caseId("C8", 3 * 2 * N + 1 + layoutIndex)} ${name} 다크 id 1의 y 값과 x 연도 글자 색이 fg.neutralMuted임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.page.evaluate(measureChart);
			t.ok("그래프가 있음", m.found, m.found, "있음");
			for (const l of [...(m.yLabels ?? []), ...(m.xLabels ?? [])]) {
				t.color(`${l.text} 색`, l.color, TOKENS.dark.fgMuted);
			}
		});
	});
}
for (const [layoutIndex, [name, vp, layout]] of LAYOUTS.entries()) {
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${vp.width}x${vp.height} ${theme}`, () => {
			test.use({ viewport: vp, colorScheme: theme });

			test(`${caseId("C8", 21 + layoutIndex * 2 + themeIndex)} ${name} ${theme} id 1의 열 폭, 열 간격, 그래프 높이, 점선 격자, x축 선, x 연도 줄이 캔버스와 같음`, async ({
				t,
			}) => {
				await t.goto("/buildings/1");
				const m = await t.page.evaluate(measureChart);
				t.ok("그래프가 있음", m.found, m.found, "있음");
				const full = c8FullChart(t, m);
				if (!full) return;
				const L = C8_LAYOUT[layout];
				t.eq(
					"열 템플릿 첫 열(글자 열 폭)",
					full.gridCols.split(" ")[0],
					`${L.col}px`,
				);
				t.eq("열 간격", full.colGap, "10px");
				t.near("글자 열 높이", full.ycol.h, L.h, 0.5);
				t.near("그래프 높이", full.box.h, L.h, 1);
				t.near("svg 높이", full.svg?.h, L.h, 0.5);
				t.near("svg 폭이 그래프 상자 폭과 같음", full.svg?.w, full.box.w, 0.5);
				t.eq("svg는 보조 기술에서 숨김", full.svg?.ariaHidden, "true");
				t.eq(
					"role과 거래 이력 섹션 안",
					[full.role, full.inDealHistory],
					["img", true],
				);
				t.eq("선 개수(위쪽, 가운데, 아래쪽 x축)", full.lines.length, 3);
				const ys = [0, L.h / 2, L.h];
				full.lines.forEach((ln, i) => {
					t.near(`선 ${i} y`, ln.y, ys[i], 1);
					t.near(`선 ${i} 폭`, ln.w, full.box.w, 0.5);
					t.eq(`선 ${i} 굵기`, ln.sw, "1px");
					t.color(
						`선 ${i} 색 stroke.neutralWeak`,
						ln.stroke,
						TOKENS[theme].strokeWeak,
					);
					if (i < 2) t.eq(`선 ${i} 점선 3 3`, ln.dash, "3px, 3px");
					else t.eq("x축 선은 실선", ln.dash, "none");
				});
				t.near("x 연도 줄 높이", full.xRow.h, 18, 0.5);
				t.near("x 연도 줄과 그래프 사이 간격", full.xRow.mt, 6, 0.5);
			});
		});
	}
}
// aria-label: 캔버스 chartLabel과 같은 문구
for (const [layoutIndex, [name, vp]] of LAYOUTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		test(`${caseId("C8", 25 + layoutIndex)} ${name}에서 id별 그래프 role=img의 aria-label이 캔버스 chartLabel과 같음`, async ({
			t,
		}) => {
			for (const id of [1, 2, 3, 4, 5]) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await t.page.evaluate(measureChart);
				t.eq(`id ${id} aria-label`, m.aria, c8Expect(dealsOf(id)).label);
				t.eq(`id ${id} 점 개수`, m.points?.length, dealsOf(id).length);
			}
		});
	});
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C8-27 그래프는 두 레이아웃 DOM에 하나씩 있고 보이는 것은 하나임", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureChart);
		t.eq("DOM 안 그래프 개수", m.domCount, 2);
		t.eq("보이는 그래프 개수", m.visibleCount, 1);
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

		test(`${caseId("C8", 28 + index)} ${w}px에서 그래프가 ${layout === "mobile" ? "모바일" : "데스크톱"} 크기로 하나만 보임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.page.evaluate(measureChart);
			const L = C8_LAYOUT[layout];
			t.eq("보이는 그래프 개수", m.visibleCount, 1);
			t.near("그래프 높이", m.box?.h, L.h, 1);
			t.near("글자 열 폭", m.ycol?.w, L.col, 0.5);
			t.eq("점 개수", m.points?.length, 6);
			t.ok(
				"가로 스크롤 없음",
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
		});
	});
}
// 그래프 아래 목록과의 간격: 범례(커밋 9)와 무관하게 캔버스와 같아야 하는 값
for (const [index, [name, vp, dy]] of (
	[
		["모바일", MOBILE, 61],
		["데스크톱", DESKTOP, 76],
	] as const
).entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		test(`${caseId("C8", 30 + index)} ${name}에서 x 연도 줄 아래 끝과 다음 목록 첫 글자 사이 간격이 캔버스와 같음 (id 1과 4는 ${dy}, id 3은 이전 건물 거래 제목까지 22)`, async ({
			t,
		}) => {
			for (const [id, expectDy, text] of [
				[1, dy, "2026.08"],
				[4, dy, "2026.03"],
				[3, 22, "이전 건물 거래"],
			] as const) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await t.page.evaluate(measureChart);
				t.eq(`id ${id} 다음 글자`, m.firstAfter?.text, text);
				t.near(`id ${id} 간격`, m.firstAfter?.dy, expectDy, 1);
			}
		});
	});
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C8-32 ?type=wolse가 붙어도 id 1의 그래프는 기본과 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await t.page.evaluate(measureChart);
		t.eq("점 개수", m.points?.length, 6);
		t.eq("aria-label", m.aria, c8Expect(C8_DEALS.default ?? []).label);
	});
});
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C8-33 320px에서 id 1, 3, 4의 그래프가 가로 스크롤 없이 들어오고 점이 6개, 1개, 3개임", async ({
		t,
	}) => {
		for (const [id, n] of [
			[1, 6],
			[3, 1],
			[4, 3],
		] as const) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.page.evaluate(measureChart);
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.eq(`id ${id} 점 개수`, m.points?.length, n);
			t.near(
				`id ${id} 그래프 상자 폭 (320 - 34 - 32 - 82)`,
				m.box?.w,
				206 - 2 * MOBILE_CARD.x,
				1,
			);
		}
	});
});
