// S2 건물 상세 C10: 주변 전월세 거래 골격과 필터
// 2026-11-09 피드백 9번: 필터 칩을 Seed Select 선택 상자로 바꿈. 선택 상자 문구, 선택지 목록, 선택 후 주소로 확인함
// 기대값 출처: 설계 2절(상태표, 주요 간격 주변 필터와 면적 고정 줄과 안내 상자), 3절(문구), 7절(색), 9절(role), 4.3절과 계획 커밋 10(쿼리 처리), 캔버스 S2(Mobile|Desktop)(Default|Few|NoLoc)와 Dark* 보드
// 건수 줄, 목록, 조건 확장 안내, 확정일자 안내, 질문하기는 이후 커밋이라 여기서 보지 않음

import { c10CheckAreaRow } from "../support/buildingDetail/c10CheckAreaRow";
import { c10CheckDesktopFilterLayout } from "../support/buildingDetail/c10CheckDesktopFilterLayout";
import { c10CheckDesktopShell } from "../support/buildingDetail/c10CheckDesktopShell";
import { c10CheckFilterContent } from "../support/buildingDetail/c10CheckFilterContent";
import { c10CheckLabelStyle } from "../support/buildingDetail/c10CheckLabelStyle";
import { c10CheckMobileFilterLayout } from "../support/buildingDetail/c10CheckMobileFilterLayout";
import { c10CheckMobileShell } from "../support/buildingDetail/c10CheckMobileShell";
import { c10CheckNotice } from "../support/buildingDetail/c10CheckNotice";
import { c10CheckOptions } from "../support/buildingDetail/c10CheckOptions";
import { c10CheckTriggerLayout } from "../support/buildingDetail/c10CheckTriggerLayout";
import {
	C10_AREA_IDS,
	C10_DEFAULT,
	C10_FILTER_IDS,
	C10_QUERY_CASES,
	type C10Cond,
} from "../support/buildingDetail/c10Fixtures";
import { c10MeasureNearby } from "../support/buildingDetail/c10MeasureNearby";
import { c10NearbyHref } from "../support/buildingDetail/c10NearbyHref";
import type { T } from "../support/buildingDetail/makeT";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];
const LAYOUTS = [
	["모바일", MOBILE, "mobile"],
	["데스크톱", DESKTOP, "desktop"],
] as const;

const nearbyMeasure = (t: T) => t.page.evaluate(c10MeasureNearby);

// 모바일 id 1 기본
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} ${theme}`, () => {
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C10", 1 + themeIndex)} 모바일 ${theme} id 1은 주변 전월세 거래 섹션 껍데기, 선택 상자 문구와 모양, 선택지 목록, 면적 고정 줄이 설계와 같음`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await nearbyMeasure(t);
			c10CheckMobileShell(t, m, "모바일");
			c10CheckFilterContent(t, m, C10_DEFAULT, "모바일");
			c10CheckTriggerLayout(t, m, "mobile", "모바일");
			c10CheckLabelStyle(t, m, "모바일");
			c10CheckMobileFilterLayout(t, m, true, "모바일");
			c10CheckAreaRow(t, m, "모바일");
			t.eq("모바일 note 없음", m.noteCount, 0);
			t.eq("모바일 위치 정보 없음 문구 없음", m.bodyHasNotice, false);
			await c10CheckOptions(t, C10_DEFAULT, "모바일");
		});
	});
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C10-03 모바일 id 1에 ?type=wolse가 붙으면 유형 선택 상자가 월세를 보여 주고 선택지 목록에서 월세만 선택됨", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await nearbyMeasure(t);
		const cond = { ...C10_DEFAULT, type: "wolse" };
		c10CheckFilterContent(t, m, cond, "월세");
		t.ok("면적 고정 줄 있음(월세 선택에서도)", !!m.area, m.area, "있음");
		await c10CheckOptions(t, cond, "월세");
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} dark`, () => {
	test.use({ viewport: MOBILE, colorScheme: "dark" });

	test("C10-04 모바일 다크 id 1에 ?type=wolse가 붙어도 선택 상자가 월세를 보여 주고 선택지 목록이 열림", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await nearbyMeasure(t);
		c10CheckFilterContent(t, m, { ...C10_DEFAULT, type: "wolse" }, "월세");
		await c10CheckOptions(t, { ...C10_DEFAULT, type: "wolse" }, "월세");
	});
});

// 데스크톱 id 1 기본
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C10", 5 + themeIndex)} 데스크톱 ${theme} id 1은 주변 전월세 거래 카드, 필터 상자(간격 12/28), 선택 상자, 선택지 목록, 면적 고정 줄이 설계와 같음`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await nearbyMeasure(t);
			c10CheckDesktopShell(t, m, "데스크톱");
			c10CheckFilterContent(t, m, C10_DEFAULT, "데스크톱");
			c10CheckTriggerLayout(t, m, "desktop", "데스크톱");
			c10CheckLabelStyle(t, m, "데스크톱");
			c10CheckDesktopFilterLayout(t, m, true, "데스크톱");
			c10CheckAreaRow(t, m, "데스크톱");
			t.eq("데스크톱 note 없음", m.noteCount, 0);
			await c10CheckOptions(t, C10_DEFAULT, "데스크톱");
		});
	});
}
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C10-07 데스크톱 id 1에 ?type=wolse가 붙으면 유형 선택 상자가 월세를 보여 주고 선택지 목록에서 월세만 선택됨", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await nearbyMeasure(t);
		const cond = { ...C10_DEFAULT, type: "wolse" };
		c10CheckFilterContent(t, m, cond, "월세");
		await c10CheckOptions(t, cond, "월세");
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} dark`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "dark" });

	test("C10-08 데스크톱 다크 id 1에 ?type=wolse가 붙어도 선택 상자가 월세를 보여 주고 선택지 목록이 열림", async ({
		t,
	}) => {
		await t.goto("/buildings/1?type=wolse");
		const m = await nearbyMeasure(t);
		c10CheckFilterContent(t, m, { ...C10_DEFAULT, type: "wolse" }, "월세");
		await c10CheckOptions(t, { ...C10_DEFAULT, type: "wolse" }, "월세");
	});
});

// 면적 고정 줄 유무
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C10", 9 + layoutIndex)} ${name} 면적 고정 줄은 id ${C10_AREA_IDS.join(", ")}에만 있고 id 3에는 없으며 id 3의 필터는 그대로임`, async ({
			t,
		}) => {
			for (const id of C10_FILTER_IDS) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await nearbyMeasure(t);
				const has = C10_AREA_IDS.includes(id);
				t.eq(`id ${id} 면적 고정 줄`, !!m.area, has);
				c10CheckFilterContent(t, m, C10_DEFAULT, `id ${id}`);
				if (layout === "mobile") {
					c10CheckMobileFilterLayout(t, m, has, `id ${id}`);
				} else {
					c10CheckDesktopFilterLayout(t, m, has, `id ${id}`);
				}
			}
		});
	});
}

// 위치 정보 없음(id 4)
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${viewport.width}x${viewport.height} ${theme}`, () => {
			test.use({ viewport, colorScheme: theme });

			test(`${caseId("C10", 11 + 2 * layoutIndex + themeIndex)} ${name} ${theme} id 4는 제목과 위치 정보 없음 안내(role="note")만 있고 필터와 면적 줄이 없음`, async ({
				t,
			}) => {
				await t.goto("/buildings/4");
				const m = await nearbyMeasure(t);
				if (layout === "mobile") {
					c10CheckMobileShell(t, m, name);
				} else {
					c10CheckDesktopShell(t, m, name);
				}
				c10CheckNotice(t, m, layout, name);
				t.eq(
					`${name} 선택 상자 개수`,
					(m.groups ?? []).filter((g) => g.trigger).length,
					0,
				);
			});
		});
	}
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C10-15 위치 정보 없음 안내는 id 4에만 있고 id 1, 2, 3, 5에는 없음", async ({
		t,
	}) => {
		for (const id of [1, 2, 3, 5]) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await nearbyMeasure(t);
			t.eq(`id ${id} note 개수`, m.noteCount, 0);
			t.eq(`id ${id} 위치 정보 없음 문구`, m.bodyHasNotice, false);
			t.eq(`id ${id} 면적 줄이 아닌 안내 없음`, m.notice, null);
		}
	});
});

// id 중복, 레이아웃
for (const [layoutIndex, [name, viewport, layout]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C10", 16 + layoutIndex)} ${name}에서 주변 거래 id가 레이아웃마다 한 번씩만 있고(-mobile, -desktop) 보이는 것은 ${layout}뿐이며 그룹이 자기 라벨을 가리킴`, async ({
			t,
		}) => {
			for (const id of [1, 3, 4]) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await nearbyMeasure(t);
				t.eq(`id ${id} 문서 안 중복 id`, m.dupIds, []);
				t.eq(`id ${id} 제목 DOM 개수와 id`, m.titleIdsDom, [
					"nearby-deals-title-desktop",
					"nearby-deals-title-mobile",
				]);
				t.eq(`id ${id} 보이는 제목 개수`, m.visibleTitles, 1);
				t.eq(
					`id ${id} 보이는 제목 id`,
					m.title?.id,
					`nearby-deals-title-${layout}`,
				);
				const want =
					id === 4
						? ["nearby-deals-title-desktop", "nearby-deals-title-mobile"]
						: ["desktop", "mobile"]
								.flatMap((l) => [
									`nearby-deals-title-${l}`,
									...["period", "radius", "type"].map(
										(n) => `nearby-filter-${n}-${l}`,
									),
								])
								.sort();
				t.eq(`id ${id} nearby- 접두 id 목록`, m.nearbyIds, want);
				for (const g of m.groups ?? []) {
					t.eq(
						`id ${id} 그룹 aria-labelledby 접미사 -${layout}`,
						(g.labelledBy ?? "").split("-").pop(),
						layout,
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

		test(`${caseId("C10", 18 + index)} ${w}px에서 주변 거래가 ${mobile ? "모바일(필터 상자 배경 없음)" : "데스크톱(필터 상자 배경 있음)"} 하나만 보임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await nearbyMeasure(t);
			t.eq("보이는 제목 개수", m.visibleTitles, 1);
			t.eq(
				"보이는 제목 id",
				m.title?.id,
				mobile ? "nearby-deals-title-mobile" : "nearby-deals-title-desktop",
			);
			t.eq(
				"보이는 선택 상자 개수",
				(m.groups ?? []).filter((g) => g.trigger).length,
				3,
			);
			t.eq("필터 묶음 가로 배치", m.box?.dir, "row");
			t.eq(
				"필터 상자 배경 없음 여부",
				m.box?.bg === "rgba(0, 0, 0, 0)",
				mobile,
			);
			t.ok(
				"가로 스크롤 없음",
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.eq("면적 줄 개수", !!m.area, true);
		});
	});
}
test.describe("1280x900 light", () => {
	test.use({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });

	test("C10-20 1280px에서 id 1, 3, 4의 주변 거래가 가로 스크롤 없이 들어옴", async ({
		t,
	}) => {
		for (const id of [1, 3, 4]) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await nearbyMeasure(t);
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`≤ ${m.vw}`,
			);
		}
	});
});
test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C10-21 320px에서 id 1, 3, 4의 주변 거래가 가로 스크롤 없이 들어오고 선택 상자가 모두 화면 안에 있음", async ({
		t,
	}) => {
		for (const id of [1, 3, 4]) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await nearbyMeasure(t);
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			for (const g of m.groups ?? []) {
				t.ok(
					`id ${id} ${g.labelText} 선택 상자 오른쪽 끝이 화면 안`,
					(g.trigger?.rect.r ?? Number.POSITIVE_INFINITY) <= m.vw - 16 + 0.5,
					g.trigger?.rect.r,
					`≤ ${m.vw - 16}`,
				);
			}
			if (m.notice?.rect) {
				t.ok(
					`id ${id} 안내 오른쪽 끝이 화면 안`,
					m.notice.rect.r <= m.vw - 16 + 0.5,
					m.notice.rect.r,
					`≤ ${m.vw - 16}`,
				);
			}
			if (m.area) {
				t.ok(
					`id ${id} 면적 문구 오른쪽 끝이 화면 안`,
					m.area.rect.r <= m.vw - 16 + 0.5,
					m.area.rect.r,
					`≤ ${m.vw - 16}`,
				);
			}
		}
	});
});

// 쿼리 처리(Review Focus 2): 항목 하나가 잘못되어도 그 항목만 기본값이고 나머지는 유지
for (const [layoutIndex, [name, viewport]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C10", 22 + layoutIndex)} ${name} 쿼리가 잘못된 항목만 기본값(500, 12, 전세)이 되고 나머지 조건은 유지되며 오류가 없음`, async ({
			t,
		}) => {
			for (const [label, q, change] of C10_QUERY_CASES) {
				const cond = { ...C10_DEFAULT, ...change };
				t.issues.length = 0;
				const status = await t.goto(`/buildings/1${q}`, 500);
				t.eq(`${label} 상태 코드`, status, 200);
				const m = await nearbyMeasure(t);
				c10CheckFilterContent(t, m, cond, label);
				for (const i of t.issues) t.fail(`${label}: ${i}`);
			}
		});
	});
}

// 선택지 고르기: 쿼리 변경, 선택 상자 문구 변경, 스크롤 위치 유지
for (const [layoutIndex, [name, viewport]] of LAYOUTS.entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C10", 24 + layoutIndex)} ${name}에서 선택지를 고르면 쿼리와 선택 상자 문구가 바뀌고 다른 조건은 유지되며 스크롤 위치가 유지됨`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			let cond: C10Cond = { ...C10_DEFAULT };
			const steps: [keyof C10Cond, string, string, number | string][] = [
				["type", "유형", "월세", "wolse"],
				["radius", "반경", "1km", 1000],
				["period", "기간", "6개월", 6],
				["radius", "반경", "300m", 300],
				["type", "유형", "전세", "jeonse"],
			];
			t.issues.length = 0;
			for (const [name2, group, text, value] of steps) {
				const trigger = t.page.getByRole("combobox", { name: group });
				await trigger.scrollIntoViewIfNeeded();
				await t.page.waitForTimeout(150);
				const before = await t.page.evaluate(() => window.scrollY);
				t.ok(
					`${text} 고르기 전 스크롤이 0보다 큼(스크롤 유지를 볼 수 있음)`,
					before > 0,
					before,
					"> 0",
				);
				cond = { ...cond, [name2]: value };
				const url = c10NearbyHref(1, cond);
				await trigger.click();
				// 선택지 목록이 자리를 잡기 전에 누르면 Playwright가 화면을 스크롤하므로 기다림
				await t.page.waitForTimeout(300);
				await t.page.getByRole("option", { name: text, exact: true }).click();
				await t.page
					.waitForURL((u) => u.pathname + u.search === url, { timeout: 15000 })
					.catch(() => undefined);
				await t.page.waitForTimeout(600);
				const now = await t.page.evaluate(
					() => location.pathname + location.search,
				);
				t.eq(`${text} 고른 뒤 주소`, now, url);
				const after = await t.page.evaluate(() => window.scrollY);
				t.near(`${text} 고른 뒤 스크롤 위치 유지`, after, before, 2);
				const m = await nearbyMeasure(t);
				c10CheckFilterContent(t, m, cond, `${text} 선택 후`);
			}
			for (const i of t.issues) t.fail(i);
		});
	});
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C10-26 선택지를 고르지 않고 직접 주소로 들어가도 선택 상자가 같은 값을 보여 줌(새로고침 시 유지)", async ({
		t,
	}) => {
		await t.goto("/buildings/1?radius=1000&period=24&type=wolse");
		let m = await nearbyMeasure(t);
		c10CheckFilterContent(
			t,
			m,
			{ radius: 1000, period: 24, type: "wolse" },
			"직접 진입",
		);
		await t.page.reload({ waitUntil: "load" });
		await t.page.waitForTimeout(500);
		m = await nearbyMeasure(t);
		c10CheckFilterContent(
			t,
			m,
			{ radius: 1000, period: 24, type: "wolse" },
			"새로고침",
		);
	});
});
