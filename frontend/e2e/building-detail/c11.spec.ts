// S2 건물 상세 C11: 주변 전월세 거래 건수 줄, 목록, 확정일자 안내
// 기대값 출처: 설계 2절(상태표, 글자 크기, 주요 간격 건수 줄과 안내 상자와 주변 거래 목록), 3절(문구), 7절(색), 9절(role), 12절 18번(건물명 기호는 실제 이름으로 바꿔 건물명 문구는 검사하지 않음)과 31번(월세 금액),
//   캔버스 S2(Mobile|Desktop)(Default|Few|Zero|NoLoc)와 Dark* 보드의 NJ, NM, NF 데이터
// 조건 확장 안내는 C12에서 보고, 질문하기(커밋 13)는 이후 커밋이라 여기서 보지 않음. 그래서 "조건에 맞는 거래 N건" 굵은 건수가 있는 줄만 건수 줄로 보고, 확정일자 안내는 문구로 찾음

import { C10_NOTICE } from "../support/buildingDetail/c10Notice";
import { c11Bounds } from "../support/buildingDetail/c11Bounds";
import { c11CheckDesktopRows } from "../support/buildingDetail/c11CheckDesktopRows";
import { c11CheckMobileRows } from "../support/buildingDetail/c11CheckMobileRows";
import { c11CheckNotice } from "../support/buildingDetail/c11CheckNotice";
import { c11CheckRowsContent } from "../support/buildingDetail/c11CheckRowsContent";
import { c11CheckSummary } from "../support/buildingDetail/c11CheckSummary";
import { c11Confirmed } from "../support/buildingDetail/c11Confirmed";
import {
	C11_FJ,
	C11_FW,
	C11_HEADS,
	C11_J,
	C11_LONG_NAMES,
	C11_NOTICE,
	C11_STATES,
	C11_W,
} from "../support/buildingDetail/c11Fixtures";
import { c11Measure } from "../support/buildingDetail/c11Measure";
import { c11MeasureLongName } from "../support/buildingDetail/c11MeasureLongName";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_COLUMN } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];
const LAYOUTS = [
	["모바일", MOBILE, "mobile"],
	["데스크톱", DESKTOP, "desktop"],
] as const;
const WOLSE_AMOUNT = /^보증금 [\d,]+만원 \/ 월 \d+만원$/;

// 상태별 내용
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C11", 1 + layoutIndex)} ${name} id 1, 2, 3, 5의 전세와 월세에서 건수, 기준 월, 행 순서와 내용, 확정일자 안내가 설계와 같음`, async ({
			t,
		}) => {
			for (const s of C11_STATES) {
				t.issues.length = 0;
				const status = await t.goto(`/buildings/${s.id}${s.q}`, 500);
				const l = `${name} ${s.label}`;
				t.eq(`${l} 상태 코드`, status, 200);
				const m = await c11Measure(t);
				t.eq(`${l} 섹션이 보임`, m.found, true);
				c11CheckSummary(t, m, layout, s.count, l);
				c11CheckRowsContent(t, m, layout, s.rows, l);
				t.eq(
					`${l} 확정일자 안내 개수(건수가 0이어도 있음)`,
					c11Confirmed(m).length,
					1,
				);
				t.eq(
					`${l} 안내 문구`,
					c11Confirmed(m)[0]?.texts.map((x) => x.t),
					[C11_NOTICE],
				);
				for (const i of t.issues) t.fail(`${l}: ${i}`);
			}
		});
	});
}
for (const [layoutIndex, [name, viewport]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C11", 3 + layoutIndex)} ${name}에서 id 4는 건수 줄, 목록, 확정일자 안내가 없고 위치 정보 없음 안내만 있음`, async ({
			t,
		}) => {
			await t.goto("/buildings/4");
			const m = await c11Measure(t);
			t.eq("건수 줄 없음", m.summary, null);
			t.eq(
				"목록 없음(ul, table)",
				[m.ul, m.tables, m.lis.length, m.trs.length],
				[0, 0, 0, 0],
			);
			t.eq("확정일자 안내 없음", c11Confirmed(m).length, 0);
			t.ok(
				"본문에 확정일자 문구가 없음",
				!m.bodyText.includes("확정일자를 기준으로"),
				"있음",
				"없음",
			);
			t.ok(
				"본문에 건수 문구가 없음",
				!m.bodyText.includes("조건에 맞는 거래"),
				"있음",
				"없음",
			);
			t.eq(
				"위치 정보 없음 안내만 note로 있음",
				(m.notes ?? []).map((n) => n.texts.map((x) => x.t)),
				[[C10_NOTICE]],
			);
		});
	});
}

// 모양과 위치: id 1 기본
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} ${theme}`, () => {
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C11", 5 + 2 * themeIndex)} 모바일 ${theme} id 1은 건수 줄, 14개 목록 항목, 구분 칩, 확정일자 안내의 크기, 색, 간격이 설계와 같음`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await c11Measure(t);
			c11CheckSummary(t, m, "mobile", 14, "모바일");
			c11CheckRowsContent(t, m, "mobile", C11_J, "모바일");
			c11CheckMobileRows(t, m, "모바일");
			c11CheckNotice(t, m, "mobile", "모바일");
			t.near(
				"마지막 행 아래에서 안내까지 16",
				(c11Confirmed(m)[0]?.y ?? Number.NaN) -
					(m.lis[m.lis.length - 1]?.rect.b ?? Number.NaN),
				16,
				0.5,
			);
		});
	});
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C11", 6 + 2 * themeIndex)} 데스크톱 ${theme} id 1은 건수 줄, table 머리와 14개 행, 구분 칩, 확정일자 안내의 크기, 색, 열 위치, 간격이 설계와 같음`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await c11Measure(t);
			c11CheckSummary(t, m, "desktop", 14, "데스크톱");
			c11CheckRowsContent(t, m, "desktop", C11_J, "데스크톱");
			c11CheckDesktopRows(t, m, "데스크톱");
			c11CheckNotice(t, m, "desktop", "데스크톱");
			t.near(
				"마지막 행 아래에서 안내까지 20",
				(c11Confirmed(m)[0]?.y ?? Number.NaN) -
					(m.trs[m.trs.length - 1]?.rect.b ?? Number.NaN),
				20,
				0.5,
			);
		});
	});
}

// 월세: 금액 표기와 폭
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C11-09 모바일 월세는 9개 항목의 금액이 보증금 / 월 형식이고 한 줄에 행 폭의 55% 안에 들어감", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await c11Measure(t);
		c11CheckSummary(t, m, "mobile", 9, "모바일 월세");
		c11CheckRowsContent(t, m, "mobile", C11_W, "모바일 월세");
		c11CheckMobileRows(t, m, "모바일 월세");
		c11CheckNotice(t, m, "mobile", "모바일 월세");
		m.lis.forEach((r, i) => {
			t.ok(
				`${i + 1}행 금액이 "보증금 ... / 월 ..." 모양`,
				WOLSE_AMOUNT.test(r.texts[4]?.t ?? ""),
				r.texts[4]?.t,
				"보증금 N만원 / 월 N만원",
			);
		});
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C11-10 데스크톱 월세는 9개 행의 금액이 보증금 / 월 형식이고 오른쪽 정렬로 한 줄에 들어감", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await c11Measure(t);
		c11CheckSummary(t, m, "desktop", 9, "데스크톱 월세");
		c11CheckRowsContent(t, m, "desktop", C11_W, "데스크톱 월세");
		c11CheckDesktopRows(t, m, "데스크톱 월세");
		c11CheckNotice(t, m, "desktop", "데스크톱 월세");
		m.trs.forEach((r, i) => {
			t.ok(
				`${i + 1}행 금액이 "보증금 ... / 월 ..." 모양`,
				WOLSE_AMOUNT.test(r.texts[4]?.t ?? ""),
				r.texts[4]?.t,
				"보증금 N만원 / 월 N만원",
			);
		});
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} dark`, () => {
	test.use({ viewport: MOBILE, colorScheme: "dark" });

	test("C11-11 모바일 다크 월세에서도 금액과 구분 칩, 안내 색이 다크 토큰과 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await c11Measure(t);
		c11CheckSummary(t, m, "mobile", 9, "다크 월세");
		c11CheckMobileRows(t, m, "다크 월세");
		c11CheckNotice(t, m, "mobile", "다크 월세");
	});
});

// 거래 적음(id 3): 2행과 1행. 조건 확장 안내는 C12에서 봄
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C11", 12 + layoutIndex)} ${name} id 3은 전세 2행, 월세 1행으로 건수 줄과 목록, 확정일자 안내의 모양과 위치가 설계와 같음`, async ({
			t,
		}) => {
			for (const [q, count, rows] of [
				["", 2, C11_FJ],
				["?type=wolse", 1, C11_FW],
			] as const) {
				await t.goto(`/buildings/3${q}`);
				const m = await c11Measure(t);
				const l = `${name} id 3 ${q ? "월세" : "전세"}`;
				c11CheckSummary(t, m, layout, count, l);
				c11CheckRowsContent(t, m, layout, [...rows], l);
				if (layout === "mobile") {
					c11CheckMobileRows(t, m, l);
				} else {
					c11CheckDesktopRows(t, m, l);
				}
				c11CheckNotice(t, m, layout, l);
			}
		});
	});
}

// 0건(id 2): 건수 줄과 확정일자 안내만
for (const [index, [name, viewport, layout, theme]] of (
	[
		["모바일", MOBILE, "mobile", "light"],
		["데스크톱", DESKTOP, "desktop", "dark"],
		["모바일", MOBILE, "mobile", "dark"],
		["데스크톱", DESKTOP, "desktop", "light"],
	] as const
).entries()) {
	test.describe(`${viewport.width}x${viewport.height} ${theme}`, () => {
		test.use({ viewport, colorScheme: theme });

		test(`${caseId("C11", 14 + index)} ${name} ${theme} id 2는 0건 건수 줄과 확정일자 안내만 있고 목록은 없음`, async ({
			t,
		}) => {
			for (const q of ["", "?type=wolse"]) {
				await t.goto(`/buildings/2${q}`);
				const m = await c11Measure(t);
				const l = `${name} id 2 ${q ? "월세" : "전세"}`;
				c11CheckSummary(t, m, layout, 0, l);
				c11CheckRowsContent(t, m, layout, [], l);
				t.eq(
					`${l} header와 행 없음`,
					[m.header, m.lis.length, m.trs.length],
					[null, 0, 0],
				);
				c11CheckNotice(t, m, layout, l);
				t.near(
					`${l} 건수 줄 아래에서 확정일자 안내까지 간격(C12 조건 확장 안내 70이 사이에 있음) ${layout === "mobile" ? 16 : 20}x2 + 70`,
					(c11Confirmed(m)[0]?.y ?? Number.NaN) -
						(m.summary?.rect.b ?? Number.NaN),
					(layout === "mobile" ? 16 : 20) * 2 + 70,
					0.5,
				);
			}
		});
	});
}

// 구조(role)
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C11-18 데스크톱 목록은 이름이 주변 전월세 거래인 table이고 머리 행과 14개 행, 행마다 cell 5개이며 ul이 보이지 않음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await c11Measure(t);
		t.eq("보이는 table 개수", m.tables, 1);
		t.eq("table 이름", m.tableLabel, "주변 전월세 거래");
		t.eq("보이는 ul 개수", m.ul, 0);
		t.eq(
			"머리 행 columnheader 문구",
			m.header?.texts.map((x) => x.t),
			C11_HEADS,
		);
		t.eq("데이터 행 role", [...new Set(m.trs.map((r) => r.role))], ["row"]);
		t.eq("데이터 행 개수", m.trs.length, 14);
		t.eq("행마다 cell 개수", [...new Set(m.trs.map((r) => r.cells))], [5]);
		t.eq("li 없음", m.lis.length, 0);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C11-19 모바일 목록은 ul 아래 li 14개이고 table과 머리 행이 보이지 않음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await c11Measure(t);
		t.eq("보이는 ul 개수", m.ul, 1);
		t.eq("li 개수", m.lis.length, 14);
		t.eq("보이는 table 개수", m.tables, 0);
		t.eq("머리 행 없음", m.header, null);
	});
});

// 기준선 정렬
for (const [layoutIndex, [name, viewport]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C11", 20 + layoutIndex)} ${name} 건수 줄은 계산된 align-items가 baseline이고 건수와 기준 월의 기준선이 같음(id 1, 2, 3)`, async ({
			t,
		}) => {
			for (const id of [1, 2, 3]) {
				await t.goto(`/buildings/${id}`);
				const m = await c11Measure(t);
				t.eq(`${name} id ${id} align-items`, m.summary?.ai, "baseline");
				t.near(
					`${name} id ${id} 기준선 차이`,
					(m.summary?.countBaseline ?? Number.NaN) -
						(m.summary?.baseBaseline ?? Number.NaN),
					0,
					0.5,
				);
			}
		});
	});
}

// 반응형
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C11-22 320px에서 id 1 전세와 월세, id 2, id 3은 가로 스크롤이 없고 목록 금액이 행 안쪽에 들어옴", async ({
		t,
	}) => {
		for (const [id, q] of [
			[1, ""],
			[1, "?type=wolse"],
			[2, ""],
			[3, ""],
			[3, "?type=wolse"],
		] as const) {
			await t.goto(`/buildings/${id}${q}`, 400);
			const m = await c11Measure(t);
			const l = `id ${id}${q ? " 월세" : ""}`;
			t.ok(
				`${l} 가로 스크롤`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.near(`${l} 섹션 w`, m.section.w, 320 - 2 * MOBILE_COLUMN.x, 0.5);
			const b = c11Bounds(m, "mobile");
			for (const [i, r] of m.lis.entries()) {
				const name = r.texts[0];
				const amount = r.texts[4];
				t.near(`${l} ${i + 1}행 x와 w`, r.rect.x + r.rect.w, b.r, 0.5);
				t.ok(
					`${l} ${i + 1}행 금액이 행 안에서 폭 55% 이하`,
					(amount?.w ?? Number.NaN) <= (b.r - b.l) * 0.55 + 0.5,
					amount?.w,
					`≤ ${(b.r - b.l) * 0.55}`,
				);
				t.ok(
					`${l} ${i + 1}행 금액 오른쪽 끝이 행 오른쪽 끝`,
					Math.abs((amount?.r ?? Number.NaN) - b.r) <= 0.5,
					amount?.r,
					String(b.r),
				);
				t.ok(
					`${l} ${i + 1}행 건물명이 금액과 겹치지 않음`,
					(name?.r ?? Number.NaN) <= (amount?.x ?? Number.NaN) + 0.5,
					name?.r,
					`≤ ${amount?.x}`,
				);
			}
			t.eq(`${l} 확정일자 안내 개수`, c11Confirmed(m).length, 1);
			const n = c11Confirmed(m)[0];
			t.ok(
				`${l} 안내 상자가 섹션 안`,
				!!n && n.x >= m.section.x + 15.5 && n.r <= m.section.r - 15.5,
				n?.x,
				"섹션 안",
			);
			t.ok(`${l} 안내 높이가 50 이상`, (n?.h ?? 0) >= 49.5, n?.h, "≥ 50");
		}
	});
});
test.describe("768x900 light", () => {
	test.use({ viewport: { width: 768, height: 900 }, colorScheme: "light" });

	test("C11-23 768px 태블릿에서 모바일 구조의 목록이 폭 720 열 안에서 같은 행 모양으로 나옴", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await c11Measure(t);
		// 카드가 없어 열 폭 720을 그대로 씀(2026-11-13 흰 세로 열)
		t.near("섹션 w(열 720)", m.section.w, 720, 1);
		c11CheckSummary(t, m, "mobile", 14, "태블릿");
		c11CheckRowsContent(t, m, "mobile", C11_J, "태블릿");
		c11CheckMobileRows(t, m, "태블릿");
		c11CheckNotice(t, m, "mobile", "태블릿");
	});
});
test.describe("1279x900 light", () => {
	test.use({ viewport: { width: 1279, height: 900 }, colorScheme: "light" });

	test("C11-24 1279px와 1280px 사이에서 목록이 ul(14개 li)에서 table(머리 + 14개 행)로 한 번에 바뀌고 하나만 보임", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const step = async (label: string, w: number, desktop: boolean) => {
			await t.page.setViewportSize({ width: w, height: 900 });
			await t.page.waitForTimeout(250);
			const m = await c11Measure(t);
			t.eq(`${label} 보이는 ul 개수`, m.ul, desktop ? 0 : 1);
			t.eq(`${label} 보이는 table 개수`, m.tables, desktop ? 1 : 0);
			t.eq(`${label} li 개수`, m.lis.length, desktop ? 0 : 14);
			t.eq(`${label} table 데이터 행 개수`, m.trs.length, desktop ? 14 : 0);
			t.eq(`${label} 건수 줄 개수`, m.summary ? 1 : 0, 1);
			t.eq(`${label} 확정일자 안내 개수`, c11Confirmed(m).length, 1);
			t.eq(
				`${label} 건수 줄 기준 월 글자 크기`,
				m.summary?.base.fs,
				desktop ? "13px" : "12px",
			);
		};
		await step("1279", 1279, false);
		await step("1280", 1280, true);
		await step("다시 1279", 1279, false);
	});
});

// 중복 id와 오류
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C11-25 모든 건물과 필터에서 id가 중복되지 않고 콘솔 오류와 hydration 경고가 없음", async ({
		t,
	}) => {
		for (const [id, q] of [
			[1, ""],
			[1, "?type=wolse"],
			[2, ""],
			[3, ""],
			[3, "?type=wolse"],
			[4, ""],
			[5, ""],
		] as const) {
			t.issues.length = 0;
			await t.goto(`/buildings/${id}${q}`, 500);
			const m = await c11Measure(t);
			t.eq(`id ${id}${q ? " 월세" : ""} 중복 id`, m.dupIds, []);
			for (const i of t.issues) t.fail(`id ${id}${q ? " 월세" : ""}: ${i}`);
		}
	});
});

// 건물명 한 줄 말줄임 (설계 12절 32번, 사용자가 정함)
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	for (const [nameIndex, [label, longName]] of C11_LONG_NAMES.entries()) {
		test.describe(`${viewport.width}x${viewport.height} light`, () => {
			test.use({ viewport, colorScheme: "light" });

			test(`${caseId("C11", 26 + layoutIndex * C11_LONG_NAMES.length + nameIndex)} ${name} 목록의 건물명이 ${label}이면 한 줄로 말줄임되고 옆 칸과 페이지 폭을 넘지 않음`, async ({
				t,
			}) => {
				await t.goto("/buildings/1", 500);
				const m = await c11MeasureLongName(t, layout, longName);
				t.eq("첫 행을 찾음", m.found, true);
				if (!m.found) return;
				t.eq("글자가 바뀜", m.after, longName);
				t.eq("줄 높이", m.lh, "22px");
				t.near("건물명 높이가 한 줄(22)", m.name.h, 22, 0.5);
				t.ok(
					"글자가 잘림(scrollWidth > clientWidth)",
					m.sw > m.cw,
					`${m.sw} / ${m.cw}`,
					"scrollWidth > clientWidth",
				);
				t.eq("text-overflow", m.to, "ellipsis");
				t.eq("overflow-x", m.ov, "hidden");
				t.ok(
					"건물명 오른쪽이 자기 칸 안",
					m.name.r <= m.limit.r + 0.5,
					`${m.name.r} / ${m.limit.r}`,
					"name.right <= limit.right",
				);
				t.ok(
					layout === "mobile"
						? "건물명이 금액 상자를 침범하지 않음"
						: "건물명이 구분 칸을 침범하지 않음",
					m.name.r <= m.neighbor.x + 0.5,
					`${m.name.r} / ${m.neighbor.x}`,
					"name.right <= neighbor.left",
				);
				if (layout === "mobile") {
					t.ok(
						"금액 상자가 행 안쪽",
						m.neighbor.r <= (m.row?.r ?? Number.NaN) + 0.5,
						`${m.neighbor.r} / ${m.row?.r}`,
						"amountBox.right <= row.right",
					);
				} else {
					t.eq("행의 cell 개수", m.cells, 5);
					t.ok(
						"구분 칩이 건물명 오른쪽",
						!m.chipText || m.chipText.x >= m.name.r - 0.5,
						m.chipText && `${m.chipText.x} / ${m.name.r}`,
						"chip.left >= name.right",
					);
				}
				t.ok(
					"가로 스크롤이 없음",
					m.pageSw <= m.pageCw,
					`${m.pageSw} / ${m.pageCw}`,
					"scrollWidth <= clientWidth",
				);
			});
		});
	}
}
