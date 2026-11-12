// 모바일과 태블릿 하단 내비게이션, 흰 세로 열, 하단 푸터 UI TC
// 기대값: 설계 문서(2026-11-12-mobile-nav-card-design.md) 3, 6, 9, 10절과 캔버스 Col*Mobile, Col*Tablet 보드
// 안전 영역 높이는 브라우저에서 값이 0이라 확인하지 않음
// /me는 sessionMock이 { provider: "KAKAO" }일 때만 열려 TC_SESSION=in일 때만 돌림. 로그아웃 전제 TC는 TC_SESSION=in이면 건너뜀
import { expect } from "@playwright/test";
import { parseShadow } from "./support/bottomNav/parseShadow";
import { readColumn } from "./support/bottomNav/readColumn";
import {
	readChatPanelEdge,
	readDesktopHeaderEdge,
	readHeaderEdge,
} from "./support/bottomNav/readHeaderEdge";
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
// 로그인하지 않으면 셋째 탭 이름이 로그인임(2026-11-13 요청). 아이콘은 그대로임
const THIRD_TAB = LOGGED_IN ? "내 정보" : "로그인";
const NAV = '[data-area="bottom-nav"]';
const TAB_HEIGHT = 56;
// 안쪽 목록 폭 최대. 태블릿에서도 열 폭을 넘지 않음
const LIST_MAX_WIDTH = 720;
const FOOTER_HEIGHT = 44;
const LIGHT_WHITE = "rgb(255, 255, 255)";
const DARK_WHITE = "rgb(22, 23, 27)";

const SMALL_SCREENS = [
	{ label: "모바일", viewport: MOBILE, columnWidth: 390, columnX: 0 },
	{ label: "태블릿", viewport: TABLET, columnWidth: 720, columnX: 24 },
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

const COLUMN_PATHS = [
	{ name: "홈", path: "/" },
	{ name: "검색 결과", path: SEARCH_PATH },
	{ name: "건물 상세", path: "/buildings/1" },
	{ name: "로그인", path: "/login" },
	{ name: "이용약관", path: "/policies/terms" },
	{ name: "개인정보처리방침", path: "/policies/privacy" },
	{ name: "데이터 출처", path: "/policies/data-sources" },
];

// 화면마다 하단 바는 설계 문서 10.3절. 로그인과 정책은 하단 바가 없음
const STACK_PATHS = [
	{ name: "홈", path: "/", bar: "chat-panel-mobile" },
	{ name: "검색 결과", path: SEARCH_PATH, bar: "chat-compact-bar" },
	{ name: "건물 상세", path: "/buildings/1", bar: "ask-building-bar" },
	{ name: "로그인", path: "/login", bar: null },
	{ name: "이용약관", path: "/policies/terms", bar: null },
	{ name: "개인정보처리방침", path: "/policies/privacy", bar: null },
	{ name: "데이터 출처", path: "/policies/data-sources", bar: null },
] as const;

let number = 1;

for (const { label, viewport, columnWidth, columnX } of SMALL_SCREENS) {
	for (const colorScheme of ["light", "dark"] as const) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${colorScheme}`, () => {
			test.use({ viewport, colorScheme });

			test(`${caseId("NAV", number++)} ${label} 하단 내비게이션이 보이고 탭이 홈, 집사, ${THIRD_TAB} 순서임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				const nav = page.locator(NAV);
				await expect.soft(nav).toBeVisible();
				await expect.soft(nav).toHaveAttribute("aria-label", "하단 내비게이션");
				await expect
					.soft(nav.locator("a"))
					.toHaveText(["홈", "집사", THIRD_TAB]);
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

			for (const { name, path, bar } of STACK_PATHS) {
				test(`${caseId("NAV", number++)} ${label} ${name}에서 하단 바, 푸터, 내비게이션이 화면 아래에 이 순서로 붙고 푸터 높이가 44이며 위 테두리가 없음`, async ({
					page,
				}) => {
					test.skip(
						LOGGED_IN && path === "/login",
						"로그인한 상태에서는 /login이 홈으로 이동함",
					);
					await gotoAndSettle(page, path);
					const footer = await readBox(
						page.locator('[data-area="footer-mobile"]'),
					);
					const nav = await readBox(page.locator(NAV));
					expect
						.soft(nav.y + nav.height, "내비게이션 아래 끝이 화면 아래")
						.toBeCloseTo(viewport.height, 0);
					expect
						.soft(footer.y + footer.height, "푸터 아래 끝이 내비게이션 위 끝")
						.toBeCloseTo(nav.y, 0);
					expect.soft(footer.height, "푸터 높이").toBeCloseTo(FOOTER_HEIGHT, 0);
					const footerBorderTop = await page
						.locator('[data-area="footer-mobile"] > *')
						.first()
						.evaluate((element) => getComputedStyle(element).borderTopWidth);
					expect.soft(footerBorderTop, "푸터 위 테두리").toBe("0px");
					if (bar) {
						const barBox = await readBox(page.locator(`[data-area="${bar}"]`));
						expect
							.soft(barBox.y + barBox.height, "하단 바 아래 끝이 푸터 위 끝")
							.toBeCloseTo(footer.y, 0);
					}
				});

				test(`${caseId("NAV", number++)} ${label} ${name}를 끝까지 스크롤하면 본문이 하단 바나 푸터 위에서 끝나고 푸터가 내비게이션 바로 위에 있음`, async ({
					page,
				}) => {
					test.skip(
						LOGGED_IN && path === "/login",
						"로그인한 상태에서는 /login이 홈으로 이동함",
					);
					await gotoAndSettle(page, path);
					await scrollToEnd(page);
					const main = await readBox(page.locator('[data-area="main"]'));
					const footer = await readBox(
						page.locator('[data-area="footer-mobile"]'),
					);
					const nav = await readBox(page.locator(NAV));
					const upperEdge = bar
						? (await readBox(page.locator(`[data-area="${bar}"]`))).y
						: footer.y;
					expect
						.soft(
							main.y + main.height,
							"본문 아래 끝이 하단 바나 푸터 위 끝 이하",
						)
						.toBeLessThanOrEqual(upperEdge + 1);
					expect
						.soft(footer.y + footer.height, "푸터 아래 끝이 내비게이션 위 끝")
						.toBeCloseTo(nav.y, 0);
				});

				test(`${caseId("NAV", number++)} ${label} ${name}에서 열이 폭 ${columnWidth}의 흰색이고 main에 카드 모양이 없음`, async ({
					page,
				}) => {
					test.skip(
						LOGGED_IN && path === "/login",
						"로그인한 상태에서는 /login이 홈으로 이동함",
					);
					await gotoAndSettle(page, path);
					const column = await readColumn(page);
					const white = colorScheme === "dark" ? DARK_WHITE : LIGHT_WHITE;
					expect.soft(column.columnBackground, "열 배경").toBe(white);
					expect
						.soft(column.columnBackground, "열과 body 배경이 다름")
						.not.toBe(column.bodyBackground);
					expect
						.soft(column.headerBackground, "헤더 배경이 열 배경과 같음")
						.toBe(column.columnBackground);
					expect.soft(column.columnWidth, "열 폭").toBeCloseTo(columnWidth, 0);
					expect.soft(column.columnX, "열 왼쪽 바깥").toBeCloseTo(columnX, 0);
					expect
						.soft(
							column.viewportWidth - column.columnX - column.columnWidth,
							"열 오른쪽 바깥",
						)
						.toBeCloseTo(columnX, 0);
					expect
						.soft(column.mainWidth, "main 폭이 열 폭과 같음")
						.toBeCloseTo(column.columnWidth, 0);
					expect.soft(column.mainBorderTopWidth, "main 테두리").toBe("0px");
					expect.soft(column.mainBorderRadius, "main 모서리").toBe("0px");
					expect.soft(column.mainMarginLeft, "main 왼쪽 여백").toBe("0px");
					expect.soft(column.mainMarginRight, "main 오른쪽 여백").toBe("0px");
				});
			}

			test(`${caseId("NAV", number++)} ${label} 헤더 아래 구분선이 챗봇 패널 위쪽 가장자리의 테두리와 그림자를 아래로 뒤집은 값임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				const header = await readHeaderEdge(page);
				const panel = await readChatPanelEdge(page);
				expect.soft(header.borderBottomWidth, "헤더 아래 테두리").toBe("1px");
				expect
					.soft(
						header.borderBottomColor,
						"헤더 아래 테두리 색이 패널 위 테두리 색과 같음",
					)
					.toBe(panel.borderTopColor);
				const headerShadow = parseShadow(header.boxShadow);
				const panelShadow = parseShadow(panel.boxShadow);
				expect.soft(headerShadow.y, "헤더 그림자 y").toBe(6);
				expect.soft(headerShadow.blur, "헤더 그림자 blur").toBe(20);
				expect.soft(headerShadow.x, "헤더 그림자 x").toBe(0);
				expect.soft(headerShadow.spread, "헤더 그림자 spread").toBe(0);
				expect
					.soft(headerShadow.y, "헤더 그림자 y가 패널 그림자 y의 반대")
					.toBe(-panelShadow.y);
				expect
					.soft(headerShadow.color, "헤더 그림자 색이 패널 그림자 색과 같음")
					.toBe(panelShadow.color);
			});

			test(`${caseId("NAV", number++)} ${label} 건물 상세를 스크롤하기 전과 뒤에 푸터와 내비게이션 위치가 같고 푸터 링크 세 개가 보임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/buildings/1");
				const footerLinks = page.locator('[data-area="footer-mobile"] a');
				await expect
					.soft(footerLinks)
					.toHaveText(["데이터 출처", "이용약관", "개인정보처리방침"]);
				for (let index = 0; index < 3; index++) {
					await expect.soft(footerLinks.nth(index)).toBeInViewport();
				}
				const before = await readBox(
					page.locator('[data-area="footer-mobile"]'),
				);
				await scrollToEnd(page);
				const after = await readBox(
					page.locator('[data-area="footer-mobile"]'),
				);
				expect.soft(after.y, "푸터 y").toBeCloseTo(before.y, 0);
				expect.soft(after.height, "푸터 높이").toBeCloseTo(before.height, 0);
			});

			test(`${caseId("NAV", number++)} ${label} /me에서 열이 폭 ${columnWidth}의 흰색이고 푸터가 내비게이션 바로 위에 있음`, async ({
				page,
			}) => {
				test.skip(!LOGGED_IN, "로그인 상태 TC는 TC_SESSION=in일 때만 돌림");
				await gotoAndSettle(page, "/me");
				const column = await readColumn(page);
				const white = colorScheme === "dark" ? DARK_WHITE : LIGHT_WHITE;
				expect.soft(column.columnBackground, "열 배경").toBe(white);
				expect.soft(column.columnWidth, "열 폭").toBeCloseTo(columnWidth, 0);
				expect.soft(column.mainBorderTopWidth, "main 테두리").toBe("0px");
				const footer = await readBox(
					page.locator('[data-area="footer-mobile"]'),
				);
				const nav = await readBox(page.locator(NAV));
				expect
					.soft(footer.y + footer.height, "푸터 아래 끝이 내비게이션 위 끝")
					.toBeCloseTo(nav.y, 0);
				expect
					.soft(nav.y + nav.height, "내비게이션 아래 끝이 화면 아래")
					.toBeCloseTo(viewport.height, 0);
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

		for (const { name, path } of COLUMN_PATHS) {
			test(`${caseId("NAV", number++)} ${label}에서 ${name}의 page-column이 흰색이 아니고 main에 카드 모양이 없고 푸터가 고정되지 않음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, path);
				const column = await page
					.locator('[data-area="page-column"]')
					.evaluate((element) => getComputedStyle(element).backgroundColor);
				expect.soft(column, "열 배경").toBe("rgba(0, 0, 0, 0)");
				const main = await page
					.locator('[data-area="main"]')
					.first()
					.evaluate((element) => {
						const style = getComputedStyle(element);
						return {
							border: style.borderTopWidth,
							radius: style.borderTopLeftRadius,
						};
					});
				expect.soft(main.border, "테두리").toBe("0px");
				expect.soft(main.radius, "모서리").toBe("0px");
				const footerPosition = await page
					.locator("footer")
					.first()
					.evaluate((element) => getComputedStyle(element).position);
				expect.soft(footerPosition, "푸터 position").toBe("static");
			});
		}

		test(`${caseId("NAV", number++)} ${label}에서 데스크톱 헤더에 그림자가 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			const edge = await readDesktopHeaderEdge(page);
			expect.soft(edge.boxShadow, "그림자").toBe("none");
		});
	});
}
