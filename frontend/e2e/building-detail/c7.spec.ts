// S2 건물 상세 C7 거래 이력: 이전 건물 거래
// 기대값 출처: 설계 2절(제목 16/22 bold, 설명 13px, 간격), 3절(문구), 7절(색), 12절, 캔버스 보드 S2(Mobile|Desktop)Few와 DarkS2(Mobile|Desktop)Few
// 캔버스: 모바일 블록 padding-top 4, 제목과 설명 간격 4, 설명과 목록 간격 4(모바일) 8(데스크톱: 설명 margin-bottom 4 + gap 4), 데스크톱은 머리 행 없음, 해제와 유사 건물 배지 없음
// 점 그래프(커밋 8)가 아직 없어 제목 위쪽 절대 위치는 보지 않고 블록 안의 상대 위치만 봄. 이전 건물 거래는 id 3만 있음(목업)

import { C6_TOKENS } from "../support/buildingDetail/c6Tokens";
import { c7CheckPrevBlock } from "../support/buildingDetail/c7CheckPrevBlock";
import { PREV_DEAL, PREV_TITLE } from "../support/buildingDetail/c7PrevDeal";
import { checkDealsBottom } from "../support/buildingDetail/checkDealsBottom";
import { checkDesktopDeals } from "../support/buildingDetail/checkDesktopDeals";
import { checkMobileDeals } from "../support/buildingDetail/checkMobileDeals";
import { measureDeals } from "../support/buildingDetail/measureDeals";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_CARD } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

for (const [layoutIndex, [name, viewport, layout]] of (
	[
		["모바일", MOBILE, "mobile"],
		["데스크톱", DESKTOP, "desktop"],
	] as const
).entries()) {
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${viewport.width}x${viewport.height} ${theme}`, () => {
			test.use({ viewport, colorScheme: theme });

			test(`${caseId("C7", 1 + layoutIndex * 2 + themeIndex)} ${name} ${theme}에서 id 3의 이전 건물 거래 블록이 캔버스 보드와 같음 (제목, 설명, 간격, 1건 행, 머리 행과 배지 없음)`, async ({
				t,
			}) => {
				await t.goto("/buildings/3");
				const m = await t.page.evaluate(measureDeals, "prev" as const);
				const tk = C6_TOKENS[theme];
				t.ok("거래 이력 섹션이 보임", m.found, m.found, "있음");
				if (layout === "mobile") {
					const rowX = MOBILE_CARD.x + 16;
					c7CheckPrevBlock(t, m, layout, tk, rowX);
					t.eq("모바일 ul 하나, li 하나", [m.ulCount, m.liCount], [1, 1]);
					checkMobileDeals(
						t,
						m,
						[PREV_DEAL],
						tk,
						MOBILE_CARD.x,
						MOBILE_CARD.width,
					);
					checkDealsBottom(t, m, 24);
				} else {
					const rowX = 177;
					c7CheckPrevBlock(t, m, layout, tk, rowX);
					t.eq("데스크톱 ul 없음", m.ulCount, 0);
					checkDesktopDeals(t, m, [PREV_DEAL], tk, rowX, 682, true);
					checkDealsBottom(t, m, 29);
				}
				t.eq(
					"이전 건물 거래의 문구 순서(행 안): 모바일은 구분, 날짜, 면적, 금액 / 데스크톱은 날짜, 구분, 면적, 금액",
					[
						m.rows[0]?.badges.map((x) => x.text),
						m.rows[0]?.date.text,
						m.rows[0]?.area.text,
						m.rows[0]?.amount.text,
					],
					[[PREV_DEAL.type], PREV_DEAL.date, PREV_DEAL.area, PREV_DEAL.amount],
				);
			});
		});
	}
}
for (const [idIndex, id] of [1, 2, 4, 5].entries()) {
	for (const [layoutIndex, [name, viewport]] of (
		[
			["모바일", MOBILE],
			["데스크톱", DESKTOP],
		] as const
	).entries()) {
		test.describe(`${viewport.width}x${viewport.height} light`, () => {
			test.use({ viewport, colorScheme: "light" });

			test(`${caseId("C7", 5 + idIndex * 2 + layoutIndex)} ${name} id ${id}에는 이전 건물 거래 블록이 없음`, async ({
				t,
			}) => {
				await t.goto(`/buildings/${id}`);
				const m = await t.page.evaluate(measureDeals, "prev" as const);
				t.eq(
					"이전 건물 거래 제목 (DOM 전체, 숨은 레이아웃 포함)",
					m.block?.domTotal,
					0,
				);
				t.eq(
					"이전 건물 거래 설명 문구가 문서에 없음",
					m.block?.bodyHasDescription,
					false,
				);
				t.eq(
					"이전 건물 거래 목록과 행이 없음",
					[m.ulCount, m.table, m.rows.length],
					[0, null, 0],
				);
			});
		});
	}
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C7-13 id 3은 두 레이아웃 DOM에 이전 건물 거래 제목이 하나씩만 있고 보이는 것은 하나임", async ({
		t,
	}) => {
		await t.goto("/buildings/3");
		const m = await t.page.evaluate(measureDeals, "prev" as const);
		t.eq("DOM 안 제목 개수 (모바일, 데스크톱)", m.block?.domTotal, 2);
		t.eq("보이는 제목 개수", m.block?.visibleCount, 1);
		t.eq("문서 안 중복 id 없음", m.dupIds, []);
	});
	test("C7-17 id 3의 현재 건물 거래 목록은 이전 건물 블록 때문에 생기지 않음 (현재 범위 ul, table 없음)", async ({
		t,
	}) => {
		await t.goto("/buildings/3");
		const m = await t.page.evaluate(measureDeals, "current" as const);
		t.eq(
			"현재 건물 ul, li, table 없음",
			[m.ulCount, m.liCount, m.table],
			[0, 0, null],
		);
	});
});
for (const [index, [w, mobile]] of (
	[
		[1279, true],
		[1280, false],
	] as const
).entries()) {
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C7", 14 + index)} ${w}px에서 이전 건물 거래가 ${mobile ? "모바일 목록(ul)" : "데스크톱 표(table, 이전 건물 거래 라벨)"} 하나만 보임`, async ({
			t,
		}) => {
			await t.goto("/buildings/3");
			const m = await t.page.evaluate(measureDeals, "prev" as const);
			t.eq("보이는 이전 건물 거래 제목 개수", m.block?.visibleCount, 1);
			t.eq("보이는 ul 개수", m.ulCount, mobile ? 1 : 0);
			t.eq(
				"보이는 table 라벨",
				m.table?.label ?? null,
				mobile ? null : PREV_TITLE,
			);
			t.eq("행 수", m.rows.length, 1);
			t.ok(
				"가로 스크롤 없음",
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
		});
	});
}
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C7-16 320px에서 id 3의 이전 건물 거래 목록이 가로 스크롤 없이 들어오고 금액 칸이 행 폭의 55%를 넘지 않음", async ({
		t,
	}) => {
		await t.goto("/buildings/3", 400);
		const m = await t.page.evaluate(measureDeals, "prev" as const);
		t.ok("가로 스크롤 없음", m.scrollW <= m.vw, m.scrollW, `문서 폭 ≤ ${m.vw}`);
		checkMobileDeals(
			t,
			m,
			[PREV_DEAL],
			C6_TOKENS.light,
			MOBILE_CARD.x,
			320 - 2 * MOBILE_CARD.x,
		);
	});
});
