// S2 건물 상세 C5: 외부 링크 (공시가격알리미, 안심전세 앱)

import { c5CheckLinkCommon } from "../support/buildingDetail/c5CheckLinkCommon";
import { c5CheckLinkLayout } from "../support/buildingDetail/c5CheckLinkLayout";
import { c5CheckLinkTheme } from "../support/buildingDetail/c5CheckLinkTheme";
import { LINKS } from "../support/buildingDetail/c5Links";
import { c5MeasureLinks } from "../support/buildingDetail/c5MeasureLinks";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_COLUMN } from "../support/viewports";

const VIEWPORTS = [
	["모바일", MOBILE],
	["데스크톱", DESKTOP],
] as const;

test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C5-01 모바일 id 1의 외부 링크 두 개가 건축물대장 기준 월 줄 아래 2열로 나오고 크기와 스타일이 캔버스와 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(c5MeasureLinks);
		c5CheckLinkCommon(t, m, "모바일");
		c5CheckLinkLayout(t, m, "모바일", true);
		c5CheckLinkTheme(t, m, "모바일");
		// 캔버스 S2MobileDefault는 링크 x 16과 199, 폭 175. 본문 카드가 없어져(2026-11-13 흰 세로 열) 앱도 같은 값임
		t.near("첫 링크 x", m.links[0]?.rect.x, MOBILE_COLUMN.x + 16, 1);
		t.near("두 번째 링크 x", m.links[1]?.rect.x, MOBILE_COLUMN.x + 199, 1);
		t.near("링크 폭", m.links[0]?.rect.w, 175, 1);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C5-02 데스크톱 id 1의 외부 링크 두 개가 aside 안에 세로로 쌓이고 크기와 스타일이 캔버스와 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.page.evaluate(c5MeasureLinks);
		c5CheckLinkCommon(t, m, "데스크톱");
		c5CheckLinkLayout(t, m, "데스크톱", false);
		c5CheckLinkTheme(t, m, "데스크톱");
		// 캔버스 S2DesktopDefault: 폭 332(앱은 카드 border 1px로 330), 링크 간격 56
		t.near(
			"링크 폭 (aside 380 - 패딩 24x2 - border 1x2)",
			m.links[0]?.rect.w,
			330,
			1,
		);
		t.near(
			"링크 간격 (48 + 8)",
			(m.links[1]?.rect.y ?? 0) - (m.links[0]?.rect.y ?? 0),
			56,
			0.5,
		);
	});
});
for (const [index, [name, vp]] of VIEWPORTS.entries()) {
	test.describe(`${vp.width}x${vp.height} dark`, () => {
		test.use({ viewport: vp, colorScheme: "dark" });

		test(`${caseId("C5", 3 + index)} ${name} 다크 모드에서 링크 배경이 bg.neutralWeak(#2b2e35)이고 글자와 아이콘이 fg.neutral임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.page.evaluate(c5MeasureLinks);
			t.eq("링크 개수", m.links.length, 2);
			t.color("다크 토큰 bg.neutralWeak", m.tokenBg, "rgb(43, 46, 53)");
			c5CheckLinkTheme(t, m, name);
		});
	});
}
for (const [index, [name, vp]] of VIEWPORTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		test(`${caseId("C5", 5 + index)} ${name}에서 건물명과 위치가 없는 id 4도 외부 링크 두 개를 보여줌`, async ({
			t,
		}) => {
			await t.goto("/buildings/4");
			const m = await t.page.evaluate(c5MeasureLinks);
			c5CheckLinkCommon(t, m, `${name} id 4`);
			c5CheckLinkLayout(t, m, `${name} id 4`, vp === MOBILE);
		});
	});
}
for (const [index, id] of [2, 3, 5].entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
		test.use({ viewport: MOBILE, colorScheme: "light" });

		test(`${caseId("C5", 7 + index)} 모바일에서 id ${id}도 외부 링크 두 개를 같은 순서와 href로 보여줌`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.page.evaluate(c5MeasureLinks);
			c5CheckLinkCommon(t, m, `id ${id}`);
		});
	});
}
for (const [index, [name, vp]] of VIEWPORTS.entries()) {
	test.describe(`${vp.width}x${vp.height} light`, () => {
		test.use({ viewport: vp, colorScheme: "light" });

		test(`${caseId("C5", 10 + index)} ${name}에서 링크를 누르면 새 페이지(탭)가 href 주소로 열리고 원래 페이지는 그대로임`, async ({
			t,
		}) => {
			// 실제 인터넷에 의존하지 않도록 외부 도메인을 가짜 응답으로 막음
			await t.page.context().route(/realtyprice\.kr|khug\.or\.kr/, (route) =>
				route.fulfill({
					status: 200,
					contentType: "text/html",
					body: "<title>stub</title><p>stub</p>",
				}),
			);
			await t.goto("/buildings/1");
			const before = t.page.url();
			for (const link of LINKS) {
				const loc = t.page.locator("section a:visible", {
					hasText: link.text,
				});
				t.eq(`${link.text} 보이는 링크 개수`, await loc.count(), 1);
				const [popup] = await Promise.all([
					t.page.context().waitForEvent("page", { timeout: 8000 }),
					loc.first().click(),
				]);
				// noopener로 열린 페이지는 처음에 주소가 비어 있으므로 이동이 끝날 때까지 기다림
				await popup
					.waitForURL((u) => u.href.startsWith(link.href), { timeout: 8000 })
					.catch(() => {});
				t.ok(
					`${link.text} 새 페이지 주소가 href로 시작함`,
					popup.url().startsWith(link.href),
					popup.url(),
					`${link.href}로 시작`,
				);
				t.eq(`${link.text} 원래 페이지 주소`, t.page.url(), before);
				await popup.close();
			}
		});
	});
}
