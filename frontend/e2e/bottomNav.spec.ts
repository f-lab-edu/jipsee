// 모바일과 태블릿 하단 내비게이션과 본문 카드 UI TC
// 기대값: 설계 문서(2026-11-12-mobile-nav-card-design.md) 3, 4, 6, 9절과 캔버스 Nav*Mobile, Nav*Tablet 보드
// 안전 영역 높이는 브라우저에서 값이 0이라 확인하지 않음
// /me는 sessionMock이 { provider: "KAKAO" }일 때만 열려 TC_SESSION=in일 때만 돌림. 로그아웃 전제 TC는 TC_SESSION=in이면 건너뜀
import { expect } from "@playwright/test";
import { readCard } from "./support/bottomNav/readCard";
import { scrollToEnd } from "./support/bottomNav/scrollToEnd";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { readBox } from "./support/policy/readBox";
import { SEARCH_PATH } from "./support/searchFixtures";
import { test } from "./support/test";
import { DESKTOP, MOBILE } from "./support/viewports";

const TABLET = { width: 768, height: 1024 };
const WIDE = { width: 1280, height: 800 };
const LOGGED_IN = process.env.TC_SESSION === "in";
const NAV = '[data-area="bottom-nav"]';
const TAB_HEIGHT = 56;
// 안쪽 목록 폭 최대. 태블릿에서도 열 폭을 넘지 않음
const LIST_MAX_WIDTH = 720;
const CARD_RADIUS = "20px";
const CARD_SIDE_MARGIN = "16px";

const SMALL_SCREENS = [
	{ label: "모바일", viewport: MOBILE, cardWidth: 358 },
	{ label: "태블릿", viewport: TABLET, cardWidth: 688 },
] as const;

const TABS = [
	{ area: "bottom-nav-home", name: "홈", href: "/" },
	{ area: "bottom-nav-chat", name: "집사", href: "/chat" },
] as const;

// 활성 판정은 설계 문서 3.2절. null이면 aria-current가 없음
const CURRENT_CASES = [
	{ path: "/", tab: "bottom-nav-home", value: "page" },
	{ path: SEARCH_PATH, tab: "bottom-nav-home", value: "true" },
	{ path: "/buildings/1", tab: "bottom-nav-home", value: "true" },
	{ path: "/login", tab: null, value: null },
	{ path: "/policies/terms", tab: null, value: null },
] as const;

const CARD_PATHS = [
	{ name: "홈", path: "/" },
	{ name: "검색 결과", path: SEARCH_PATH },
	{ name: "건물 상세", path: "/buildings/1" },
	{ name: "로그인", path: "/login" },
	{ name: "이용약관", path: "/policies/terms" },
	{ name: "개인정보처리방침", path: "/policies/privacy" },
	{ name: "데이터 출처", path: "/policies/data-sources" },
];

// 화면마다 하단 바와 푸터 영역은 설계 문서 3.4절
const BAR_PATHS = [
	{ name: "홈", path: "/", bar: "chat-panel-mobile" },
	{ name: "검색 결과", path: SEARCH_PATH, bar: "chat-compact-bar" },
	{ name: "건물 상세", path: "/buildings/1", bar: "ask-building-bar" },
] as const;

let number = 1;

for (const { label, viewport, cardWidth } of SMALL_SCREENS) {
	for (const colorScheme of ["light", "dark"] as const) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${colorScheme}`, () => {
			test.use({ viewport, colorScheme });

			test(`${caseId("NAV", number++)} ${label} 하단 내비게이션이 보이고 탭이 홈, 집사, 내 정보 순서임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				const nav = page.locator(NAV);
				await expect.soft(nav).toBeVisible();
				await expect.soft(nav).toHaveAttribute("aria-label", "하단 내비게이션");
				await expect
					.soft(nav.locator("a"))
					.toHaveText(["홈", "집사", "내 정보"]);
			});

			test(`${caseId("NAV", number++)} ${label} 탭 높이가 56이고 폭을 균등하게 나눔`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				const boxes = await Promise.all(
					["bottom-nav-home", "bottom-nav-chat", "bottom-nav-me"].map((area) =>
						readBox(page.locator(`[data-area="${area}"]`)),
					),
				);
				for (const box of boxes) {
					expect.soft(box.height, "탭 높이").toBeGreaterThanOrEqual(TAB_HEIGHT);
					expect.soft(box.height, "탭 높이").toBeLessThanOrEqual(TAB_HEIGHT);
					expect
						.soft(box.width, "탭 폭")
						.toBeCloseTo(Math.min(viewport.width, LIST_MAX_WIDTH) / 3, 0);
				}
			});

			for (const { path, tab, value } of CURRENT_CASES) {
				test(`${caseId("NAV", number++)} ${label} ${path}에서 ${tab ?? "활성 탭 없음"}의 aria-current가 ${value ?? "없음"}임`, async ({
					page,
				}) => {
					test.skip(
						LOGGED_IN && path === "/login",
						"로그인한 상태에서는 /login이 홈으로 이동함",
					);
					await gotoAndSettle(page, path);
					for (const area of [
						"bottom-nav-home",
						"bottom-nav-chat",
						"bottom-nav-me",
					]) {
						const link = page.locator(`[data-area="${area}"]`);
						if (area === tab && value !== null) {
							await expect.soft(link).toHaveAttribute("aria-current", value);
						} else {
							await expect.soft(link).not.toHaveAttribute("aria-current");
						}
					}
				});
			}

			test(`${caseId("NAV", number++)} ${label} 건물 상세를 스크롤해도 내비게이션 아래 끝이 화면 아래와 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/buildings/1");
				for (const ratio of [0, 0.5, 1]) {
					await page.evaluate(
						(r) =>
							window.scrollTo(0, document.documentElement.scrollHeight * r),
						ratio,
					);
					await page.waitForTimeout(200);
					const box = await readBox(page.locator(NAV));
					expect
						.soft(box.y + box.height, `스크롤 ${ratio}에서 내비게이션 아래 끝`)
						.toBeCloseTo(viewport.height, 0);
				}
			});

			for (const { name, path, bar } of BAR_PATHS) {
				test(`${caseId("NAV", number++)} ${label} ${name}에서 카드, 푸터, 하단 바, 내비게이션이 위에서 아래로 이어짐`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					await scrollToEnd(page);
					const card = await readBox(page.locator('[data-area="main"]'));
					const footer = await readBox(
						page.locator('[data-area="footer-mobile"]'),
					);
					const barBox = await readBox(page.locator(`[data-area="${bar}"]`));
					const nav = await readBox(page.locator(NAV));
					expect
						.soft(card.y + card.height, "카드 아래 끝이 푸터 위 끝 이하")
						.toBeLessThanOrEqual(footer.y + 1);
					expect
						.soft(footer.y + footer.height, "푸터 아래 끝이 하단 바 위 끝 이하")
						.toBeLessThanOrEqual(barBox.y + 1);
					expect
						.soft(
							barBox.y + barBox.height,
							"하단 바 아래 끝이 내비게이션 위 끝",
						)
						.toBeCloseTo(nav.y, 0);
				});
			}

			for (const { name, path } of CARD_PATHS) {
				test(`${caseId("NAV", number++)} ${label} ${name}의 main이 폭 ${cardWidth}의 카드임`, async ({
					page,
				}) => {
					test.skip(
						LOGGED_IN && path === "/login",
						"로그인한 상태에서는 /login이 홈으로 이동함",
					);
					await gotoAndSettle(page, path);
					const card = await readCard(page);
					const expectedBackground =
						colorScheme === "dark" ? "rgb(22, 23, 27)" : "rgb(255, 255, 255)";
					expect.soft(card.borderTopWidth, "테두리").toBe("1px");
					expect.soft(card.borderRadius, "모서리").toBe(CARD_RADIUS);
					expect.soft(card.marginLeft, "왼쪽 여백").toBe(CARD_SIDE_MARGIN);
					expect.soft(card.marginRight, "오른쪽 여백").toBe(CARD_SIDE_MARGIN);
					expect
						.soft(card.backgroundColor, "카드 배경")
						.toBe(expectedBackground);
					expect
						.soft(card.backgroundColor, "카드와 body 배경이 다름")
						.not.toBe(card.bodyBackground);
					expect.soft(card.width, "카드 폭").toBeCloseTo(cardWidth, 0);
				});
			}

			test(`${caseId("NAV", number++)} ${label} /me의 main이 폭 ${cardWidth}의 카드임`, async ({
				page,
			}) => {
				test.skip(!LOGGED_IN, "로그인 상태 TC는 TC_SESSION=in일 때만 돌림");
				await gotoAndSettle(page, "/me");
				const card = await readCard(page);
				expect.soft(card.borderTopWidth, "테두리").toBe("1px");
				expect.soft(card.borderRadius, "모서리").toBe(CARD_RADIUS);
				expect.soft(card.width, "카드 폭").toBeCloseTo(cardWidth, 0);
			});

			test(`${caseId("NAV", number++)} ${label} /me에서 내 정보 탭의 aria-current가 page이고 href가 /me임`, async ({
				page,
			}) => {
				test.skip(!LOGGED_IN, "로그인 상태 TC는 TC_SESSION=in일 때만 돌림");
				await gotoAndSettle(page, "/me");
				const link = page.locator('[data-area="bottom-nav-me"]');
				await expect.soft(link).toHaveAttribute("aria-current", "page");
				await expect.soft(link).toHaveAttribute("href", "/me");
			});
		});
	}

	test.describe(`${label} ${viewport.width}x${viewport.height} 링크`, () => {
		test.use({ viewport, colorScheme: "light" });

		for (const { area, name, href } of TABS) {
			test(`${caseId("NAV", number++)} ${label} ${name} 탭의 href가 ${href}임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				await expect
					.soft(page.locator(`[data-area="${area}"]`))
					.toHaveAttribute("href", href);
			});
		}

		test(`${caseId("NAV", number++)} ${label} 로그인하지 않으면 내 정보 탭의 href가 /login?next=%2Fme임`, async ({
			page,
		}) => {
			test.skip(LOGGED_IN, "로그아웃 TC는 TC_SESSION이 없을 때만 돌림");
			await gotoAndSettle(page, "/");
			await expect
				.soft(page.locator('[data-area="bottom-nav-me"]'))
				.toHaveAttribute("href", "/login?next=%2Fme");
		});

		test(`${caseId("NAV", number++)} ${label} viewport 메타에 viewport-fit=cover가 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			const content = await page
				.locator('meta[name="viewport"]')
				.getAttribute("content");
			expect.soft(content, "viewport content").toContain("viewport-fit=cover");
		});

		test(`${caseId("NAV", number++)} ${label} 홈에서 챗봇 입력에 포커스해도 내비게이션이 보임`, async ({
			page,
		}) => {
			test.skip(!LOGGED_IN, "입력창은 로그인 상태에서만 있음");
			await gotoAndSettle(page, "/");
			await page
				.locator('[data-area="chat-panel-mobile"] input')
				.first()
				.focus();
			await expect.soft(page.locator(NAV)).toBeVisible();
		});
	});
}

for (const { label, viewport } of [
	{ label: "1280", viewport: WIDE },
	{ label: "1440", viewport: DESKTOP },
]) {
	test.describe(`데스크톱 ${label} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("NAV", number++)} ${label}에서는 하단 내비게이션이 숨겨짐`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			await expect.soft(page.locator(NAV)).toBeHidden();
		});

		for (const { name, path } of CARD_PATHS) {
			test(`${caseId("NAV", number++)} ${label}에서 ${name}의 main에 카드 테두리와 모서리가 없음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, path);
				const card = await readCard(page);
				expect.soft(card.borderTopWidth, "테두리").toBe("0px");
				expect.soft(card.borderRadius, "모서리").toBe("0px");
			});
		}
	});
}
