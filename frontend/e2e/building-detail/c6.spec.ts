// S2 건물 상세 C6 거래 이력: 현재 건물 거래 목록
// 기대값 출처: 설계 2절(글자 크기, 주요 간격 거래 목록 행), 3절(거래 이력 문구), 7절(색), 9절(role), 12절 29번, 캔버스 보드 S2(Mobile|Desktop)(Default|NoLoc|Few)와 Dark* 보드
// 점 그래프와 이전 건물 거래, 주변 전월세 거래는 이후 커밋이라 여기서 보지 않음. 그래서 제목 아래 간격 같은 절대 위치는 검사하지 않고 목록 안의 상대 위치만 봄

import { c6CheckDesktopSection } from "../support/buildingDetail/c6CheckDesktopSection";
import { c6CheckMobileSection } from "../support/buildingDetail/c6CheckMobileSection";
import { DEALS } from "../support/buildingDetail/c6Deals";
import { C6_TOKENS } from "../support/buildingDetail/c6Tokens";
import { checkDealsBottom } from "../support/buildingDetail/checkDealsBottom";
import { checkDesktopDeals } from "../support/buildingDetail/checkDesktopDeals";
import { checkMobileDeals } from "../support/buildingDetail/checkMobileDeals";
import { measureDeals } from "../support/buildingDetail/measureDeals";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_CARD } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

// ---- 모바일 ----
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`${caseId("C6", 1)} 모바일 id 1은 거래 이력 섹션 제목, 앞 띠, aria-labelledby와 7건의 목록 항목이 설계와 같음`, async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		const tk = C6_TOKENS.light;
		c6CheckMobileSection(t, m, tk, MOBILE_CARD.x, MOBILE_CARD.width);
		t.eq("ul 하나", m.ulCount, 1);
		t.eq("li 7개", m.liCount, 7);
		checkMobileDeals(t, m, DEALS[1], tk, MOBILE_CARD.x, MOBILE_CARD.width);
		checkDealsBottom(t, m, 24);
	});
	for (const [index, id] of [2, 4, 5].entries()) {
		test(`${caseId("C6", 2 + index)} 모바일 id ${id}의 거래 목록이 캔버스 보드와 같음 (${DEALS[id].length}건)`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`);
			const m = await t.page.evaluate(measureDeals, "current" as const);
			checkMobileDeals(
				t,
				m,
				DEALS[id],
				C6_TOKENS.light,
				MOBILE_CARD.x,
				MOBILE_CARD.width,
			);
			checkDealsBottom(t, m, 24);
		});
	}
	test(`${caseId("C6", 5)} 모바일 id 1에 ?type=wolse가 붙어도 거래 이력 목록이 기본과 같음`, async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		t.eq("li 7개", m.liCount, 7);
		checkMobileDeals(
			t,
			m,
			DEALS[1],
			C6_TOKENS.light,
			MOBILE_CARD.x,
			MOBILE_CARD.width,
		);
	});
	test(`${caseId("C6", 8)} 모바일 id 3은 거래 이력 제목만 있고 현재 건물 거래 목록이 없음 (거래 0건)`, async ({
		t,
	}) => {
		await t.goto("/buildings/3");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		c6CheckMobileSection(
			t,
			m,
			C6_TOKENS.light,
			MOBILE_CARD.x,
			MOBILE_CARD.width,
		);
		t.eq("현재 건물 거래 ul 없음", m.ulCount, 0);
		t.eq("li 없음", m.liCount, 0);
		t.eq("table 없음", m.table, null);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} dark`, () => {
	test.use({ viewport: MOBILE, colorScheme: "dark" });

	test(`${caseId("C6", 6)} 모바일 다크에서 id 1의 거래 이력 색이 다크 토큰과 같음`, async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		const tk = C6_TOKENS.dark;
		c6CheckMobileSection(t, m, tk, MOBILE_CARD.x, MOBILE_CARD.width);
		checkMobileDeals(t, m, DEALS[1], tk, MOBILE_CARD.x, MOBILE_CARD.width);
	});
	test(`${caseId("C6", 7)} 모바일 다크에서 id 4의 거래 목록이 다크 토큰과 같음 (3건)`, async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		checkMobileDeals(
			t,
			m,
			DEALS[4],
			C6_TOKENS.dark,
			MOBILE_CARD.x,
			MOBILE_CARD.width,
		);
	});
	test(`${caseId("C6", 9)} 모바일 다크에서 id 3도 거래 이력 제목만 있고 목록이 없음`, async ({
		t,
	}) => {
		await t.goto("/buildings/3");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		c6CheckMobileSection(
			t,
			m,
			C6_TOKENS.dark,
			MOBILE_CARD.x,
			MOBILE_CARD.width,
		);
		t.eq("현재 건물 거래 ul 없음", m.ulCount, 0);
	});
});
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C6-10 320px에서 거래 목록이 가로 스크롤 없이 들어오고 금액 칸이 행 폭의 55%를 넘지 않음", async ({
		t,
	}) => {
		for (const id of [1, 4]) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.page.evaluate(measureDeals, "current" as const);
			t.ok(
				`id ${id} 가로 스크롤`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			checkMobileDeals(
				t,
				m,
				DEALS[id],
				C6_TOKENS.light,
				MOBILE_CARD.x,
				320 - 2 * MOBILE_CARD.x,
			);
		}
	});
});
test.describe("768x900 light", () => {
	test.use({ viewport: { width: 768, height: 900 }, colorScheme: "light" });

	test("C6-11 768px 태블릿에서 모바일 레이아웃의 거래 목록이 폭 688 카드 안에서 같은 구조로 나옴", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		// 열 720에서 카드 좌우 여백 32와 border 2를 뺀 값(2026-11-12)
		t.near("섹션 w (카드 안쪽 686)", m.section?.rect.w, 686, 1);
		t.eq("table 없음", m.table, null);
		t.eq("li 7개", m.liCount, 7);
		checkMobileDeals(
			t,
			m,
			DEALS[1],
			C6_TOKENS.light,
			m.section?.rect.x ?? 41,
			686,
		);
	});
});

// ---- 데스크톱 ----
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C6-12 데스크톱 id 1은 거래 이력 카드, 제목, table 머리와 7개 행이 설계와 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		const tk = C6_TOKENS.light;
		c6CheckDesktopSection(t, m, tk);
		t.eq("ul 없음(데스크톱은 table)", m.ulCount, 0);
		checkDesktopDeals(t, m, DEALS[1], tk, 144 + 1 + 32, 748 - 2 - 64);
		checkDealsBottom(t, m, 28 + 1);
	});
	for (const [index, id] of [2, 4, 5].entries()) {
		test(`${caseId("C6", 13 + index)} 데스크톱 id ${id}의 거래 표가 캔버스 보드와 같음 (${DEALS[id].length}건)`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`);
			const m = await t.page.evaluate(measureDeals, "current" as const);
			checkDesktopDeals(t, m, DEALS[id], C6_TOKENS.light, 177, 682);
			checkDealsBottom(t, m, 29);
		});
	}
	test("C6-16 데스크톱 id 1에 ?type=wolse가 붙어도 거래 표가 기본과 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		checkDesktopDeals(t, m, DEALS[1], C6_TOKENS.light, 177, 682);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} dark`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "dark" });

	test("C6-17 데스크톱 다크에서 id 1의 거래 이력 색이 다크 토큰과 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		const tk = C6_TOKENS.dark;
		c6CheckDesktopSection(t, m, tk);
		checkDesktopDeals(t, m, DEALS[1], tk, 177, 682);
	});
	test("C6-18 데스크톱 다크에서 id 4의 거래 표가 다크 토큰과 같음 (3건)", async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		checkDesktopDeals(t, m, DEALS[4], C6_TOKENS.dark, 177, 682);
	});
});
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C6", 19 + themeIndex)} 데스크톱 id 3은 거래 이력 제목만 있고 표가 없음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/3");
			const m = await t.page.evaluate(measureDeals, "current" as const);
			c6CheckDesktopSection(t, m, C6_TOKENS[theme]);
			t.eq("현재 건물 거래 table 없음", m.table, null);
			t.eq("행 없음", m.rows.length, 0);
			t.eq("머리 행 없음", m.header ?? null, null);
		});
	});
}

// ---- 공통: id, 레이아웃 전환 ----
for (const [index, [name, viewport, layout]] of (
	[
		["모바일", MOBILE, "mobile"],
		["데스크톱", DESKTOP, "desktop"],
	] as const
).entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C6", 21 + index)} ${name}에서 두 레이아웃의 거래 이력 제목 id가 각각 한 번씩만 있고 섹션이 자기 제목을 가리킴`, async ({
			t,
		}) => {
			for (const id of [1, 3]) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await t.page.evaluate(measureDeals, "current" as const);
				t.eq(`id ${id} 문서 안 중복 id`, m.dupIds, []);
				for (const l of ["mobile", "desktop"]) {
					const x = m.titleIds[l];
					t.eq(
						`id ${id} deal-history-title-${l} 개수와 문구`,
						[x.count, x.text, x.tag],
						[1, "거래 이력", "H2"],
					);
					t.eq(
						`id ${id} -${l} 섹션이 하나이고 제목을 안에 가짐`,
						[x.sections, x.titleInSection],
						[1, true],
					);
					t.eq(
						`id ${id} -${l} 섹션이 보이는지`,
						x.sectionVisible,
						l === layout ? 1 : 0,
					);
				}
			}
		});
	});
}
for (const [index, [w, mobile]] of (
	[
		[1279, true],
		[1280, false],
	] as const
).entries()) {
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C6", 23 + index)} ${w}px에서 거래 이력이 ${mobile ? "모바일 목록(ul)" : "데스크톱 표(table)"} 하나만 보임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.page.evaluate(measureDeals, "current" as const);
			t.eq("보이는 거래 이력 섹션 개수", m.visibleSections, 1);
			t.eq(
				"보이는 섹션 제목 id",
				m.title?.id,
				mobile ? "deal-history-title-mobile" : "deal-history-title-desktop",
			);
			t.eq("보이는 ul 개수", m.ulCount, mobile ? 1 : 0);
			t.eq(
				"보이는 table",
				m.table?.label ?? null,
				mobile ? null : "현재 건물 거래",
			);
			t.eq("행 수", m.rows.length, 7);
			t.ok(
				"가로 스크롤 없음",
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
		});
	});
}
