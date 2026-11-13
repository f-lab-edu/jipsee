// S4 로그인, S5 내 정보 UI TC
// 기대값: 설계 문서(2026-11-08-s4-s5-account-design.md) 5절의 로그인 링크 표와 캔버스 S4, S5 보드. 2026-11-09 피드백이 설계 문서와 다르면 피드백을 따름
// 로그인한 상태의 TC는 앱의 sessionMock이 { provider: "GOOGLE" } 같은 값일 때만 의미가 있어 TC_SESSION=in일 때만 돌림. 기본 실행은 로그아웃 TC만 돎
// S5 TC는 sessionMock의 제공자를 TC_PROVIDER(google, kakao, naver. 기본 kakao)로 알려 줘야 함. 제공자별 TC는 그 값과 맞을 때만 돎
import { expect, type Page } from "@playwright/test";
import { sameColor } from "./support/buildingDetail/sameColor";
import { TOKENS } from "./support/buildingDetail/tokens";
import { caseId } from "./support/caseId";
import { isDimmedAt } from "./support/dialog/isDimmedAt";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { test } from "./support/test";
import { BOTTOM_NAV_HEIGHT, DESKTOP, MOBILE } from "./support/viewports";

const SCREENS = [
	{ label: "모바일", viewport: MOBILE },
	{ label: "데스크톱", viewport: DESKTOP },
];

// 커밋 1: 로그인 링크에 돌아갈 경로 붙이기 (A1)
// 쿼리 값을 인코딩한 `next`가 한 번만 인코딩된 채 붙어야 함. 검색어 `노원&x`는 검색 경로에서 한 번, `next`로 넘길 때 한 번 인코딩됨
const HEADER_LOGIN_CASES = [
	{
		what: "홈",
		path: "/",
		href: "/login?next=%2F",
	},
	{
		what: "검색 결과(검색어 노원&x)",
		path: "/search?keyword=%EB%85%B8%EC%9B%90%26x",
		href: "/login?next=%2Fsearch%3Fkeyword%3D%25EB%2585%25B8%25EC%259B%2590%2526x",
	},
	{
		what: "건물 상세(반경 300, 기간 12, 전세)",
		path: "/buildings/3?radius=300&period=12&type=jeonse",
		href: "/login?next=%2Fbuildings%2F3%3Fradius%3D300%26period%3D12%26type%3Djeonse",
	},
	{
		what: "건물 상세(조건이 기본값과 다른 반경 1000, 기간 24, 월세)",
		path: "/buildings/3?radius=1000&period=24&type=wolse",
		href: "/login?next=%2Fbuildings%2F3%3Fradius%3D1000%26period%3D24%26type%3Dwolse",
	},
];

const CHAT_LOGIN_HREF = "/login?next=%2Fchat";
const ASK_LOGIN_HREF = "/login?next=%2Fchat%3FbuildingId%3D3";

for (const [screenIndex, { label, viewport }] of SCREENS.entries()) {
	const isMobile = viewport === MOBILE;
	test.describe(`${label} ${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			process.env.TC_SESSION === "in",
			"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
		);

		const base = screenIndex * (HEADER_LOGIN_CASES.length + 2);

		for (const [index, { what, path, href }] of HEADER_LOGIN_CASES.entries()) {
			test(`${caseId("A1", base + index + 1)} ${label} ${what} 헤더 로그인 링크가 ${isMobile ? "없음(하단 내비게이션 내 정보 탭이 대신함)" : href}임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, path);
				if (isMobile) {
					// 하단 내비게이션 셋째 탭 이름이 로그인이라 헤더 안에서만 확인함
					await expect(
						page
							.getByTestId("header-mobile")
							.getByRole("link", { name: "로그인", exact: true }),
					).toHaveCount(0);
					return;
				}
				await expect(
					page.getByRole("link", { name: "로그인", exact: true }),
				).toHaveAttribute("href", href);
			});
		}

		test(`${caseId("A1", base + HEADER_LOGIN_CASES.length + 1)} ${label} 홈 챗봇 패널의 로그인하고 이용하기 링크가 ${CHAT_LOGIN_HREF}임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			await expect(
				page.getByRole("link", { name: "로그인하고 이용하기" }),
			).toHaveAttribute("href", CHAT_LOGIN_HREF);
		});

		test(`${caseId("A1", base + HEADER_LOGIN_CASES.length + 2)} ${label} 건물 상세 질문하기 링크가 ${ASK_LOGIN_HREF}임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/buildings/3");
			await expect(
				page.getByRole("link", { name: /이 건물에 대해 질문하기/ }),
			).toHaveAttribute("href", ASK_LOGIN_HREF);
		});
	});
}

// 커밋 2: S4 라우트, 화면 틀, 접근 제어 (A2)
// 기대값: 설계 문서 3절 S4 표, 캔버스 S4LoginMobile과 S4LoginDesktop, 2026-11-09 피드백 7번과 8번
// 피드백 7번에 따라 모바일 헤더는 뒤로 가기, 로고 헤더이고 제목이 없음. 그래서 모바일 h1은 본문의 "집씨"임(캔버스는 헤더의 "로그인")
// 로고 묶음은 심볼 64, 간격 12, "집씨" 28/36 800 자간 -0.03em, 안내 15/22이므로 높이가 64+12+36+12+22임
const INTRO_HEIGHT = 146;
// 로고 묶음 아래 32 간격으로 제공자 버튼 묶음(52 3개와 간격 10 2개)이 붙음. 동의 문구는 2026-11-13 사용자 요청으로 삭제함
const PROVIDER_LIST_HEIGHT = 176;
const CONTENT_HEIGHT = INTRO_HEIGHT + 32 + PROVIDER_LIST_HEIGHT;
const LOGO_SIZE = 64;
const THEMES = ["light", "dark"] as const;
// 모바일 흰 세로 열(2026-11-13 설계 10.1절): 본문 카드가 없어 main이 열 폭 390을 그대로 쓰고, 좌우 여백 16을 뺀 콘텐츠 폭은 358임
const CARD_INNER_X = 0;
const CARD_INNER_WIDTH = 390;
const MOBILE_CONTENT_WIDTH = 358;
const CARD_BORDER = 0;
const LOGIN_TEXT = {
	title: "집씨",
	description: "로그인하고 챗봇을 이용해 보세요",
};

let a2Number = 1;
for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme}`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION === "in",
				"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
			);
			const token = TOKENS[theme];

			test(`${caseId("A2", a2Number++)} ${label} ${theme} /login은 200이고 문서 제목이 로그인 | 집씨임`, async ({
				page,
			}) => {
				expect(await gotoAndSettle(page, "/login")).toBe(200);
				await expect(page).toHaveTitle("로그인 | 집씨");
			});

			test(`${caseId("A2", a2Number++)} ${label} ${theme} 보이는 h1은 집씨 하나이고 28/36 800, 자간 -0.03em임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const title = page.locator("h1:visible");
				await expect(title).toHaveCount(1);
				await expect(title).toHaveText(LOGIN_TEXT.title);
				const style = await title.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
						letterSpacing: computed.letterSpacing,
						color: computed.color,
					};
				});
				expect(style.fontSize).toBe("28px");
				expect(style.lineHeight).toBe("36px");
				expect(style.fontWeight).toBe("800");
				expect(style.letterSpacing).toBe("-0.84px");
				expect(sameColor(style.color, token.fgNeutral)).toBe(true);
			});

			test(`${caseId("A2", a2Number++)} ${label} ${theme} 안내 문구가 15/22 fg.neutralMuted임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const description = page
					.getByText(LOGIN_TEXT.description)
					.locator("visible=true");
				await expect(description).toHaveCount(1);
				const style = await description.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						color: computed.color,
					};
				});
				expect(style.fontSize).toBe("15px");
				expect(style.lineHeight).toBe("22px");
				expect(sameColor(style.color, token.fgMuted)).toBe(true);
			});

			test(`${caseId("A2", a2Number++)} ${label} ${theme} 헤더에 로그인 링크가 없고 홈 링크는 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const header = page.getByTestId(
					isMobile ? "header-mobile" : "header-desktop",
				);
				await expect(
					header.getByRole("link", { name: "로그인", exact: true }),
				).toHaveCount(0);
				await expect(
					header.getByRole("link", { name: "집씨 홈" }),
				).toBeVisible();
			});

			if (isMobile) {
				test(`${caseId("A2", a2Number++)} 모바일 ${theme} 헤더 뒤로 가기 버튼이 44x44이고 로고 왼쪽에 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/login");
					const header = page.getByTestId("header-mobile");
					const back = await header
						.getByRole("button", { name: "뒤로 가기" })
						.boundingBox();
					const logo = await header
						.getByRole("link", { name: "집씨 홈" })
						.boundingBox();
					expect(back?.width).toBe(44);
					expect(back?.height).toBe(44);
					expect((back?.x ?? 0) + (back?.width ?? 0)).toBeLessThanOrEqual(
						logo?.x ?? 0,
					);
				});

				test(`${caseId("A2", a2Number++)} 모바일 ${theme} 로고 묶음이 가운데에 있고 본문 배경이 bg.layerDefault임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/login");
					const main = await page.locator('[data-area="main"]').boundingBox();
					const logo = await page
						.getByTestId("login-body-mobile")
						.locator("svg")
						.first()
						.boundingBox();
					expect(logo?.width).toBe(LOGO_SIZE);
					expect(logo?.height).toBe(LOGO_SIZE);
					// 가로는 390 가운데
					expect(
						Math.abs((logo?.x ?? 0) + LOGO_SIZE / 2 - viewport.width / 2),
					).toBeLessThanOrEqual(1);
					// 세로는 패딩 32 16 24를 뺀 영역 가운데에 로고 묶음부터 제공자 버튼 묶음까지가 놓임
					const areaTop = (main?.y ?? 0) + 32;
					const areaHeight = (main?.height ?? 0) - 32 - 24;
					expect(
						Math.abs(
							(logo?.y ?? 0) - (areaTop + (areaHeight - CONTENT_HEIGHT) / 2),
						),
					).toBeLessThanOrEqual(1);
					const background = await page
						.getByTestId("login-body-mobile")
						.locator(":scope > div")
						.evaluate((element) => getComputedStyle(element).backgroundColor);
					expect(sameColor(background, token.layerDefault)).toBe(true);
				});
				return;
			}

			test(`${caseId("A2", a2Number++)} 데스크톱 ${theme} 카드가 폭 440, 모서리 20, 테두리 1이고 section이 h1을 가리킴`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const card = page.locator('[data-area="login-card"]');
				const box = await card.boundingBox();
				expect(box?.width).toBe(440);
				const style = await card.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						tag: element.tagName,
						labelledBy: element.getAttribute("aria-labelledby"),
						radius: computed.borderTopLeftRadius,
						border: computed.borderTopWidth,
						borderColor: computed.borderTopColor,
						background: computed.backgroundColor,
						padding: computed.paddingTop,
					};
				});
				expect(style.tag).toBe("SECTION");
				expect(style.radius).toBe("20px");
				expect(style.border).toBe("1px");
				expect(style.padding).toBe("40px");
				expect(sameColor(style.borderColor, token.strokeMuted)).toBe(true);
				expect(sameColor(style.background, token.layerDefault)).toBe(true);
				const titleId = await page.locator("h1:visible").getAttribute("id");
				expect(style.labelledBy).toBe(titleId);
			});

			test(`${caseId("A2", a2Number++)} 데스크톱 ${theme} 카드가 본문 영역 가운데에 있고 로고 묶음이 카드 안 위 41에서 시작함`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const main = await page.locator('[data-area="main"]').boundingBox();
				const card = await page
					.locator('[data-area="login-card"]')
					.boundingBox();
				const logo = await page
					.getByTestId("login-body-desktop")
					.locator("svg")
					.first()
					.boundingBox();
				const cardCenterX = (card?.x ?? 0) + (card?.width ?? 0) / 2;
				const cardCenterY = (card?.y ?? 0) + (card?.height ?? 0) / 2;
				expect(Math.abs(cardCenterX - viewport.width / 2)).toBeLessThanOrEqual(
					1,
				);
				expect(
					Math.abs(cardCenterY - ((main?.y ?? 0) + (main?.height ?? 0) / 2)),
				).toBeLessThanOrEqual(1);
				expect(logo?.width).toBe(LOGO_SIZE);
				expect(logo?.height).toBe(LOGO_SIZE);
				expect(
					Math.abs((logo?.x ?? 0) + LOGO_SIZE / 2 - cardCenterX),
				).toBeLessThanOrEqual(1);
				expect(
					Math.abs((logo?.y ?? 0) - ((card?.y ?? 0) + 41)),
				).toBeLessThanOrEqual(1);
			});

			test(`${caseId("A2", a2Number++)} 데스크톱 ${theme} 로고, 제목, 안내 사이 간격이 12이고 묶음 높이가 146임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const body = page.getByTestId("login-body-desktop");
				const logo = await body.locator("svg").first().boundingBox();
				const title = await body.locator("h1").boundingBox();
				const description = await body
					.getByText(LOGIN_TEXT.description)
					.boundingBox();
				expect(title?.y).toBeCloseTo((logo?.y ?? 0) + LOGO_SIZE + 12, 0);
				expect(description?.y).toBeCloseTo((title?.y ?? 0) + 36 + 12, 0);
				expect(
					(description?.y ?? 0) + (description?.height ?? 0) - (logo?.y ?? 0),
				).toBeCloseTo(INTRO_HEIGHT, 0);
			});
		});
	}
}

// 커밋 3: 제공자 버튼 (A3)
// 기대값: 설계 문서 3절 S4 표(제공자 버튼 값과 색 표), 5절 S4 동작, 10절 3, 캔버스 S4LoginMobile과 DarkS4LoginMobile
// 높이 52, 좌우 패딩 48, 모서리 12, 16/22, 버튼 사이 10, 아이콘 상자 24를 왼쪽 16에 둠(구글과 카카오 심볼 20, 네이버 16)
// 글자 굵기는 캔버스가 600인데 Seed fontWeight에 600이 없어 700(bold)을 쓰므로 비교하지 않음
const PROVIDER_BUTTONS = [
	{
		name: "구글로 계속하기",
		segment: "google",
		iconSize: 20,
		border: 1,
		colors: {
			light: { background: "#FFFFFF", border: "#747775", text: "#1F1F1F" },
			dark: { background: "#131314", border: "#8E918F", text: "#E3E3E3" },
		},
	},
	{
		name: "카카오로 계속하기",
		segment: "kakao",
		iconSize: 20,
		border: 0,
		colors: {
			light: {
				background: "#FEE500",
				border: null,
				text: "rgba(0, 0, 0, 0.85)",
			},
			dark: {
				background: "#FEE500",
				border: null,
				text: "rgba(0, 0, 0, 0.85)",
			},
		},
	},
	{
		name: "네이버로 계속하기",
		segment: "naver",
		iconSize: 16,
		border: 0,
		colors: {
			light: { background: "#03C75A", border: null, text: "#FFFFFF" },
			dark: { background: "#03C75A", border: null, text: "#FFFFFF" },
		},
	},
];
const AUTHORIZATION_BASE = "/oauth2/authorization";
// A1의 검색 결과 케이스와 같은 값. 검색어 노원&x가 검색 경로에서 한 번, next로 넘길 때 한 번만 인코딩된 채 붙어야 함
const SEARCH_NEXT_QUERY = HEADER_LOGIN_CASES[1].href.replace("/login", "");
const AUTHORIZATION_NEXT_CASES = [
	{
		what: "/me",
		path: "/login?next=%2Fme",
		query: "?next=%2Fme",
	},
	{
		what: "검색 결과(노원&x)",
		path: HEADER_LOGIN_CASES[1].href,
		query: SEARCH_NEXT_QUERY,
	},
	{ what: "next가 없음", path: "/login", query: "" },
	{
		what: "https://evil.example",
		path: "/login?next=https%3A%2F%2Fevil.example",
		query: "",
	},
	{ what: "//evil.example", path: "/login?next=%2F%2Fevil.example", query: "" },
	{
		what: "/\\evil.example",
		path: "/login?next=%2F%5Cevil.example",
		query: "",
	},
	{
		what: "/탭/evil.example",
		path: "/login?next=%2F%09%2Fevil.example",
		query: "",
	},
	{
		what: "/줄바꿈/evil.example",
		path: "/login?next=%2F%0A%2Fevil.example",
		query: "",
	},
	{ what: "빈 값", path: "/login?next=", query: "" },
	{ what: "두 번(/a, /b)", path: "/login?next=%2Fa&next=%2Fb", query: "" },
];

let a3Number = 1;
for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;
	const bodyId = isMobile ? "login-body-mobile" : "login-body-desktop";

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 제공자 버튼`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION === "in",
				"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
			);

			test(`${caseId("A3", a3Number++)} ${label} ${theme} 버튼이 구글, 카카오, 네이버 순서이고 높이 52, 모서리 12, 간격 10임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const links = page
					.getByTestId(bodyId)
					.getByRole("link", { name: /로 계속하기$/ });
				await expect(links).toHaveCount(PROVIDER_BUTTONS.length);
				let previousBottom: number | null = null;
				for (const [index, { name }] of PROVIDER_BUTTONS.entries()) {
					const link = links.nth(index);
					await expect(link).toHaveText(name);
					const box = await link.boundingBox();
					expect(box?.height).toBe(52);
					// 모바일은 열 폭 390에서 좌우 여백 32를 뺀 값, 데스크톱은 카드 안쪽 폭
					expect(box?.width).toBe(358);
					expect(
						await link.evaluate(
							(element) => getComputedStyle(element).borderTopLeftRadius,
						),
					).toBe("12px");
					if (previousBottom !== null) {
						expect((box?.y ?? 0) - previousBottom).toBeCloseTo(10, 0);
					}
					previousBottom = (box?.y ?? 0) + (box?.height ?? 0);
				}
			});

			test(`${caseId("A3", a3Number++)} ${label} ${theme} 버튼 배경, 테두리, 글자 색이 제공자 가이드 값임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				for (const { name, border, colors } of PROVIDER_BUTTONS) {
					const expected = colors[theme];
					const style = await page
						.getByTestId(bodyId)
						.getByRole("link", { name })
						.evaluate((element) => {
							const computed = getComputedStyle(element);
							const label = [...element.querySelectorAll("span")].pop();
							return {
								background: computed.backgroundColor,
								border: computed.borderTopWidth,
								borderColor: computed.borderTopColor,
								text: label ? getComputedStyle(label).color : "",
							};
						});
					expect(sameColor(style.background, expected.background)).toBe(true);
					expect(style.border).toBe(`${border}px`);
					if (expected.border) {
						expect(sameColor(style.borderColor, expected.border)).toBe(true);
					}
					expect(sameColor(style.text, expected.text)).toBe(true);
				}
			});

			test(`${caseId("A3", a3Number++)} ${label} ${theme} 글자가 16/22이고 가운데이며 아이콘이 왼쪽 16에 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				for (const { name, iconSize, border } of PROVIDER_BUTTONS) {
					const link = page.getByTestId(bodyId).getByRole("link", { name });
					const box = await link.boundingBox();
					const text = link.getByText(name);
					const textBox = await text.boundingBox();
					const style = await text.evaluate((element) => {
						const computed = getComputedStyle(element);
						return {
							fontSize: computed.fontSize,
							lineHeight: computed.lineHeight,
						};
					});
					expect(style.fontSize).toBe("16px");
					expect(style.lineHeight).toBe("22px");
					expect(textBox?.height).toBe(22);
					expect(
						Math.abs(
							(textBox?.x ?? 0) +
								(textBox?.width ?? 0) / 2 -
								((box?.x ?? 0) + (box?.width ?? 0) / 2),
						),
					).toBeLessThanOrEqual(1);
					// 아이콘 상자 24가 테두리 안쪽 왼쪽 16에 있고 심볼이 그 안 가운데에 있음
					const icon = await link.locator("svg").boundingBox();
					expect(icon?.width).toBe(iconSize);
					expect(icon?.height).toBe(iconSize);
					expect(
						Math.abs(
							(icon?.x ?? 0) -
								((box?.x ?? 0) + border + 16 + (24 - iconSize) / 2),
						),
					).toBeLessThanOrEqual(1);
					expect(
						Math.abs(
							(icon?.y ?? 0) +
								(icon?.height ?? 0) / 2 -
								((box?.y ?? 0) + (box?.height ?? 0) / 2),
						),
					).toBeLessThanOrEqual(1);
				}
			});

			if (theme !== "light") return;

			for (const { what, path, query } of AUTHORIZATION_NEXT_CASES) {
				test(`${caseId("A3", a3Number++)} ${label} ${path}에서 버튼 href가 시작 경로에 ${query || "next 없음"}을 붙임(${what})`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					for (const { name, segment } of PROVIDER_BUTTONS) {
						await expect(
							page.getByTestId(bodyId).getByRole("link", { name }),
						).toHaveAttribute(
							"href",
							`${AUTHORIZATION_BASE}/${segment}${query}`,
						);
					}
				});
			}
		});
	}
}

test.describe("모바일 320x640 light 제공자 버튼", () => {
	test.use({ viewport: { width: 320, height: 640 }, colorScheme: "light" });
	test.skip(
		process.env.TC_SESSION === "in",
		"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
	);

	test(`${caseId("A3", a3Number++)} 모바일 320 버튼 글자가 한 줄이고 가로 스크롤이 없음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/login");
		for (const { name } of PROVIDER_BUTTONS) {
			const text = page
				.getByTestId("login-body-mobile")
				.getByRole("link", { name })
				.getByText(name);
			expect((await text.boundingBox())?.height).toBe(22);
		}
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
});

// 커밋 4: 동의 문구, 실패 안내 (A4)
// 기대값: 설계 문서 3절 S4 표(실패 안내, 동의 문구), 4절 문구, 5절 S4 동작, 캔버스 S4LoginMobile과 S4LoginErrorMobile
// 캔버스의 text-align: center는 Seed Text에 속성이 없고 새 CSS를 두지 않아 가운데 정렬은 한 줄일 때만 확인함
const A4_COLORS = {
	light: {
		criticalWeak: "#fdf0f0",
		criticalContrast: "#921708",
	},
	dark: {
		criticalWeak: "#322323",
		criticalContrast: "#f8c5c3",
	},
};
const CONSENT_TEXT = "계속하면 이용약관과 개인정보처리방침에 동의하게 돼요";
const ERROR_TEXT = "로그인하지 못했어요. 다시 시도해 주세요";
const ERROR_PATHS = [
	{ what: "/login?error", path: "/login?error" },
	{ what: "/login?error=", path: "/login?error=" },
	{ what: "/login?error=a&error=b", path: "/login?error=a&error=b" },
];

let a4Number = 1;
for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;
	const bodyId = isMobile ? "login-body-mobile" : "login-body-desktop";

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 동의 문구, 실패 안내`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION === "in",
				"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
			);
			const colors = A4_COLORS[theme];

			test(`${caseId("A4", a4Number++)} ${label} ${theme} 동의 문구와 정책 링크가 없고 버튼 묶음이 로그인 본문의 마지막 요소임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				const body = page.getByTestId(bodyId);
				await expect(body.getByText(CONSENT_TEXT)).toHaveCount(0);
				await expect(body.getByText("동의하게 돼요")).toHaveCount(0);
				await expect(body.getByRole("link", { name: "이용약관" })).toHaveCount(
					0,
				);
				await expect(
					body.getByRole("link", { name: "개인정보처리방침" }),
				).toHaveCount(0);
				await expect(body.getByRole("link")).toHaveText([
					"구글로 계속하기",
					"카카오로 계속하기",
					"네이버로 계속하기",
				]);
			});

			test(`${caseId("A4", a4Number++)} ${label} ${theme} /login에는 실패 안내가 없음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login");
				await expect(page.getByTestId(bodyId).getByRole("alert")).toHaveCount(
					0,
				);
				await expect(page.getByText(ERROR_TEXT)).toHaveCount(0);
			});

			for (const { what, path } of ERROR_PATHS) {
				test(`${caseId("A4", a4Number++)} ${label} ${theme} ${what}에서 실패 안내가 보이는 것으로 하나임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					const alerts = page
						.getByTestId(bodyId)
						.getByRole("alert")
						.locator("visible=true");
					await expect(alerts).toHaveCount(1);
					await expect(alerts).toHaveText(ERROR_TEXT);
				});
			}

			test(`${caseId("A4", a4Number++)} ${label} ${theme} 실패 안내가 높이 50, 패딩 14 16, 모서리 12, 배경 bg.criticalWeak, 글자 14/20 500 fg.criticalContrast이고 아이콘 18, 간격 10임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login?error");
				const alert = page
					.getByTestId(bodyId)
					.getByRole("alert")
					.locator("visible=true");
				const box = await alert.boundingBox();
				expect(box?.height).toBe(50);
				const style = await alert.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						paddingTop: computed.paddingTop,
						paddingLeft: computed.paddingLeft,
						radius: computed.borderTopLeftRadius,
						background: computed.backgroundColor,
					};
				});
				expect(style.paddingTop).toBe("14px");
				expect(style.paddingLeft).toBe("16px");
				expect(style.radius).toBe("12px");
				expect(sameColor(style.background, colors.criticalWeak)).toBe(true);
				const text = alert.getByText(ERROR_TEXT);
				const textStyle = await text.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						color: computed.color,
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
					};
				});
				expect(sameColor(textStyle.color, colors.criticalContrast)).toBe(true);
				expect(textStyle.fontSize).toBe("14px");
				expect(textStyle.lineHeight).toBe("20px");
				expect(textStyle.fontWeight).toBe("500");
				const icon = await alert.locator("svg").boundingBox();
				const textBox = await text.boundingBox();
				expect(icon?.width).toBe(18);
				expect(icon?.height).toBe(18);
				expect((textBox?.x ?? 0) - ((icon?.x ?? 0) + 18)).toBeCloseTo(10, 0);
			});

			test(`${caseId("A4", a4Number++)} ${label} ${theme} 실패 안내와 첫 버튼 사이가 16임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login?error");
				const body = page.getByTestId(bodyId);
				const alert = await body
					.getByRole("alert")
					.locator("visible=true")
					.boundingBox();
				const first = await body
					.getByRole("link", { name: "구글로 계속하기" })
					.boundingBox();
				expect(
					(first?.y ?? 0) - ((alert?.y ?? 0) + (alert?.height ?? 0)),
				).toBeCloseTo(16, 0);
			});

			if (theme !== "light") return;

			test(`${caseId("A4", a4Number++)} ${label} /login?error&next=/me에서 안내가 있고 버튼 href에 ?next=%2Fme가 붙음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/login?error&next=/me");
				const body = page.getByTestId(bodyId);
				await expect(
					body.getByRole("alert").locator("visible=true"),
				).toHaveCount(1);
				await expect(
					body.getByRole("link", { name: "구글로 계속하기" }),
				).toHaveAttribute("href", "/oauth2/authorization/google?next=%2Fme");
			});
		});
	}
}

// 접근 제어: 로그인한 상태로 /login에 들어오면 홈으로 감
for (const { label, viewport } of SCREENS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			process.env.TC_SESSION !== "in",
			"로그인 TC는 TC_SESSION=in일 때만 돌림",
		);

		test(`${caseId("A2", a2Number++)} ${label} 로그인한 상태로 /login?next=/me에 들어오면 홈으로 감`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/login?next=/me");
			expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe(
				"/",
			);
		});
	});
}

// 커밋 5: S5 라우트, 화면 뼈대, 로그인 수단 (A5)
// 기대값: 설계 문서 3절 S5 표, 4절 문구, 5절 S5 동작, 캔버스 S5MeMobile과 S5MeDesktop(Dark 포함), 2026-11-09 피드백 7번과 8번
// 피드백 7번에 따라 모바일 헤더는 뒤로 가기, 로고 헤더이고 제목이 없음. 그래서 모바일 h1은 본문 첫 줄의 "내 정보"임(캔버스는 헤더의 "내 정보" 18/24 700)
// 모바일 제목 줄은 위 패딩 20에 줄 24이고, 그 아래에 캔버스와 같은 로그인 수단 섹션(패딩 20 16 24)이 이어짐
// 캔버스의 섹션 높이는 패딩 20, 제목 22, 간격 12, 제공자 표시 74(아이콘 40 + 패딩 32 + 테두리 2), 간격 12, 로그아웃 48, 패딩 24임
const ME_PROVIDERS = {
	google: {
		name: "구글 계정",
		iconSize: 20,
		border: 1,
		colors: {
			light: { background: "#FFFFFF", border: "#747775" },
			dark: { background: "#131314", border: "#8E918F" },
		},
	},
	kakao: {
		name: "카카오 계정",
		iconSize: 20,
		border: 0,
		colors: {
			light: { background: "#FEE500", border: null },
			dark: { background: "#FEE500", border: null },
		},
	},
	naver: {
		name: "네이버 계정",
		iconSize: 16,
		border: 0,
		colors: {
			light: { background: "#03C75A", border: null },
			dark: { background: "#03C75A", border: null },
		},
	},
};
type MeProvider = keyof typeof ME_PROVIDERS;
const ME_PROVIDER_KEYS = Object.keys(ME_PROVIDERS) as MeProvider[];
const CURRENT_PROVIDER = (process.env.TC_PROVIDER ?? "kakao") as MeProvider;
const ME_TEXT = {
	title: "내 정보",
	provider: "로그인 수단",
	logout: "로그아웃",
};
const NEUTRAL_WEAK = { light: "rgb(243, 244, 245)", dark: "rgb(43, 46, 53)" };
const SECTION_HEIGHT = 20 + 22 + 12 + 74 + 12 + 48 + 24;
// 데스크톱 카드는 패딩 24 두 번과 테두리 2가 더해짐
const CARD_HEIGHT = 24 + 22 + 12 + 74 + 12 + 48 + 24 + 2;

let a5Number = 1;

test.describe("로그아웃 /me", () => {
	test.skip(
		process.env.TC_SESSION === "in",
		"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
	);

	test(`${caseId("A5", a5Number++)} 로그인하지 않은 /me가 화면을 그리기 전에 /login?next=%2Fme로 보냄`, async ({
		page,
	}) => {
		const response = await page.request.get("/me", { maxRedirects: 0 });
		expect(response.status()).toBe(307);
		const location = new URL(response.headers().location, "http://localhost");
		expect(location.pathname + location.search).toBe("/login?next=%2Fme");
	});

	test(`${caseId("A5", a5Number++)} 로그인하지 않은 /me를 열면 로그인 화면에 닿고 제공자 버튼에 ?next=%2Fme가 붙음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/me");
		expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe(
			"/login?next=%2Fme",
		);
		await expect(
			page
				.getByRole("link", { name: "구글로 계속하기" })
				.locator("visible=true"),
		).toHaveAttribute("href", "/oauth2/authorization/google?next=%2Fme");
	});
});

for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;
	const layout = isMobile ? "mobile" : "desktop";

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 내 정보`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION !== "in",
				"로그인 TC는 TC_SESSION=in일 때만 돌림",
			);
			const token = TOKENS[theme];
			const provider = ME_PROVIDERS[CURRENT_PROVIDER];
			const section = `[data-area="provider-section-${layout}"]`;

			test(`${caseId("A5", a5Number++)} ${label} ${theme} /me는 200이고 문서 제목이 내 정보 | 집씨임`, async ({
				page,
			}) => {
				expect(await gotoAndSettle(page, "/me")).toBe(200);
				await expect(page).toHaveTitle("내 정보 | 집씨");
			});

			test(`${caseId("A5", a5Number++)} ${label} ${theme} 보이는 h1은 내 정보 하나이고 ${isMobile ? "18/24" : "26/35"} 700 fg.neutral임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				const title = page.locator("h1:visible");
				await expect(title).toHaveCount(1);
				await expect(title).toHaveText(ME_TEXT.title);
				const style = await title.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
						color: computed.color,
					};
				});
				expect(style.fontSize).toBe(isMobile ? "18px" : "26px");
				expect(style.lineHeight).toBe(isMobile ? "24px" : "35px");
				expect(style.fontWeight).toBe("700");
				expect(sameColor(style.color, token.fgNeutral)).toBe(true);
			});

			test(`${caseId("A5", a5Number++)} ${label} ${theme} 내 정보 링크(데스크톱은 헤더, 모바일은 하단 내비게이션 탭)에 aria-current=page가 있고 /me로 감`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				// 모바일 헤더에는 계정 링크가 없고 하단 내비게이션 내 정보 탭이 대신함(2026-11-12 결정 3)
				const link = isMobile
					? page.locator('[data-area="bottom-nav-me"]')
					: page
							.getByTestId(`header-${layout}`)
							.getByRole("link", { name: ME_TEXT.title });
				await expect(link).toHaveAttribute("aria-current", "page");
				await expect(link).toHaveAttribute("href", "/me");
			});

			if (isMobile) {
				test(`${caseId("A5", a5Number++)} 모바일 ${theme} 헤더에 제목과 내 정보 링크가 없고 뒤로 가기 44x44가 로고 왼쪽에 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const header = page.getByTestId("header-mobile");
					await expect(header.locator("h1")).toHaveCount(0);
					const back = await header
						.getByRole("button", { name: "뒤로 가기" })
						.boundingBox();
					const logo = await header
						.getByRole("link", { name: "집씨 홈" })
						.boundingBox();
					expect(back?.width).toBe(44);
					expect(back?.height).toBe(44);
					expect((back?.x ?? 0) + (back?.width ?? 0)).toBeLessThanOrEqual(
						logo?.x ?? 0,
					);
					await expect(
						header.getByRole("link", { name: ME_TEXT.title }),
					).toHaveCount(0);
				});

				test(`${caseId("A5", a5Number++)} 모바일 ${theme} 제목 줄이 본문 맨 위 패딩 20 아래에 있고 로그인 수단 섹션이 그 아래에 붙으며 섹션 높이가 ${SECTION_HEIGHT}임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const main = await page.locator('[data-area="main"]').boundingBox();
					const title = await page.locator("h1:visible").boundingBox();
					const box = await page.locator(section).boundingBox();
					expect(title?.y).toBeCloseTo((main?.y ?? 0) + CARD_BORDER + 20, 0);
					expect(title?.x).toBe(CARD_INNER_X + 16);
					expect(title?.height).toBe(24);
					expect(box?.x).toBe(CARD_INNER_X);
					expect(box?.width).toBe(CARD_INNER_WIDTH);
					expect(box?.y).toBeCloseTo((main?.y ?? 0) + CARD_BORDER + 44, 0);
					expect(box?.height).toBeCloseTo(SECTION_HEIGHT, 0);
				});

				test(`${caseId("A5", a5Number++)} 모바일 ${theme} 섹션이 패딩 20 16 24이고 테두리와 모서리가 없으며 배경이 bg.layerDefault임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const style = await page.locator(section).evaluate((element) => {
						const computed = getComputedStyle(element);
						return {
							top: computed.paddingTop,
							right: computed.paddingRight,
							bottom: computed.paddingBottom,
							left: computed.paddingLeft,
							border: computed.borderTopWidth,
							radius: computed.borderTopLeftRadius,
							background: computed.backgroundColor,
						};
					});
					expect(style.top).toBe("20px");
					expect(style.right).toBe("16px");
					expect(style.bottom).toBe("24px");
					expect(style.left).toBe("16px");
					expect(style.border).toBe("0px");
					expect(style.radius).toBe("0px");
					expect(sameColor(style.background, token.layerDefault)).toBe(true);
				});
			} else {
				test(`${caseId("A5", a5Number++)} 데스크톱 ${theme} 열이 폭 480으로 가운데에 있고 h1이 본문 맨 위 40 아래에 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const main = await page.locator('[data-area="main"]').boundingBox();
					const column = await page
						.locator('[data-area="me-column"]')
						.boundingBox();
					const title = await page.locator("h1:visible").boundingBox();
					expect(column?.width).toBe(480);
					expect(
						Math.abs((column?.x ?? 0) + 240 - viewport.width / 2),
					).toBeLessThanOrEqual(1);
					expect(column?.y).toBeCloseTo((main?.y ?? 0) + 40, 0);
					expect(title?.y).toBeCloseTo(column?.y ?? 0, 0);
					expect(title?.height).toBe(35);
				});

				test(`${caseId("A5", a5Number++)} 데스크톱 ${theme} 카드가 h1 아래 24(여백 8 + 간격 16)에 폭 480, 모서리 20, 테두리 1, 패딩 24이고 높이가 ${CARD_HEIGHT}임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const title = await page.locator("h1:visible").boundingBox();
					const card = page.locator(section);
					const box = await card.boundingBox();
					expect(box?.width).toBe(480);
					expect(box?.y).toBeCloseTo(
						(title?.y ?? 0) + (title?.height ?? 0) + 8 + 16,
						0,
					);
					expect(box?.height).toBeCloseTo(CARD_HEIGHT, 0);
					const style = await card.evaluate((element) => {
						const computed = getComputedStyle(element);
						return {
							tag: element.tagName,
							labelledBy: element.getAttribute("aria-labelledby"),
							radius: computed.borderTopLeftRadius,
							border: computed.borderTopWidth,
							borderColor: computed.borderTopColor,
							padding: computed.paddingTop,
							background: computed.backgroundColor,
						};
					});
					expect(style.tag).toBe("SECTION");
					expect(style.radius).toBe("20px");
					expect(style.border).toBe("1px");
					expect(style.padding).toBe("24px");
					expect(sameColor(style.borderColor, token.strokeMuted)).toBe(true);
					expect(sameColor(style.background, token.layerDefault)).toBe(true);
				});
			}

			test(`${caseId("A5", a5Number++)} ${label} ${theme} 섹션이 로그인 수단 h2를 가리키고 h2가 16/22 700 fg.neutral임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				const labelledBy = await page
					.locator(section)
					.getAttribute("aria-labelledby");
				const heading = page.locator(`h2[id="${labelledBy}"]`);
				await expect(heading).toHaveText(ME_TEXT.provider);
				expect(await heading.locator("visible=true").count()).toBe(1);
				const style = await heading.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
						color: computed.color,
					};
				});
				expect(style.fontSize).toBe("16px");
				expect(style.lineHeight).toBe("22px");
				expect(style.fontWeight).toBe("700");
				expect(sameColor(style.color, token.fgNeutral)).toBe(true);
			});

			test(`${caseId("A5", a5Number++)} ${label} ${theme} 제공자 표시가 테두리 1 stroke.neutralWeak, 모서리 14, 패딩 16, 높이 74이고 이름이 ${provider.name} 16/22 700임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				const name = page.locator(section).getByText(provider.name);
				await expect(name).toHaveCount(1);
				const row = name.locator("xpath=..");
				const box = await row.boundingBox();
				const sectionBox = await page.locator(section).boundingBox();
				const contentWidth = isMobile ? MOBILE_CONTENT_WIDTH : 480 - 2 - 48;
				expect(box?.width).toBeCloseTo(contentWidth, 0);
				expect(box?.height).toBeCloseTo(74, 0);
				const rowStyle = await row.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						border: computed.borderTopWidth,
						borderColor: computed.borderTopColor,
						radius: computed.borderTopLeftRadius,
						padding: computed.paddingTop,
						gap: computed.columnGap,
					};
				});
				expect(rowStyle.border).toBe("1px");
				expect(sameColor(rowStyle.borderColor, token.strokeWeak)).toBe(true);
				expect(rowStyle.radius).toBe("14px");
				expect(rowStyle.padding).toBe("16px");
				expect(rowStyle.gap).toBe("12px");
				// 섹션 위 패딩과 제목 22, 간격 12 아래에 놓임
				const sectionTop = (sectionBox?.y ?? 0) + (isMobile ? 20 : 25);
				expect(box?.y).toBeCloseTo(sectionTop + 22 + 12, 0);
				const nameStyle = await name.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
						color: computed.color,
					};
				});
				expect(nameStyle.fontSize).toBe("16px");
				expect(nameStyle.lineHeight).toBe("22px");
				expect(nameStyle.fontWeight).toBe("700");
				expect(sameColor(nameStyle.color, token.fgNeutral)).toBe(true);
			});

			for (const key of ME_PROVIDER_KEYS) {
				const expected = ME_PROVIDERS[key];
				const colors = expected.colors[theme];

				test(`${caseId("A5", a5Number++)} ${label} ${theme} ${key} 아이콘 원이 40이고 배경 ${colors.background}, 테두리 ${colors.border ?? "없음"}이며 심볼 ${expected.iconSize}가 가운데에 있음`, async ({
					page,
				}) => {
					test.skip(
						CURRENT_PROVIDER !== key,
						"sessionMock의 제공자가 다르면 돌리지 않음",
					);
					await gotoAndSettle(page, "/me");
					const name = page.locator(section).getByText(expected.name);
					const circle = name.locator("xpath=../*[1]");
					const box = await circle.boundingBox();
					expect(box?.width).toBe(40);
					expect(box?.height).toBe(40);
					const style = await circle.evaluate((element) => {
						const computed = getComputedStyle(element);
						return {
							background: computed.backgroundColor,
							border: computed.borderTopWidth,
							borderColor: computed.borderTopColor,
							radius: Number.parseFloat(computed.borderTopLeftRadius),
						};
					});
					expect(sameColor(style.background, colors.background)).toBe(true);
					expect(style.border).toBe(`${expected.border}px`);
					if (colors.border) {
						expect(sameColor(style.borderColor, colors.border)).toBe(true);
					}
					expect(style.radius).toBeGreaterThanOrEqual(20);
					const symbol = circle.locator("svg");
					const symbolBox = await symbol.boundingBox();
					expect(symbolBox?.width).toBe(expected.iconSize);
					expect(symbolBox?.height).toBe(expected.iconSize);
					expect(
						Math.abs(
							(symbolBox?.x ?? 0) +
								expected.iconSize / 2 -
								((box?.x ?? 0) + 20),
						),
					).toBeLessThanOrEqual(1);
					expect(
						Math.abs(
							(symbolBox?.y ?? 0) +
								expected.iconSize / 2 -
								((box?.y ?? 0) + 20),
						),
					).toBeLessThanOrEqual(1);
					// 아이콘 원 오른쪽 12 뒤에 이름이 옴
					const nameBox = await name.boundingBox();
					expect(nameBox?.x).toBeCloseTo((box?.x ?? 0) + 40 + 12, 0);
				});
			}

			test(`${caseId("A5", a5Number++)} ${label} ${theme} 로그아웃 버튼이 제공자 표시 아래 12에 높이 48, 모서리 12, bg.neutralWeak이고 글자가 15 700 fg.neutral임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				const button = page
					.locator(section)
					.getByRole("button", { name: ME_TEXT.logout });
				await expect(button).toHaveCount(1);
				const box = await button.boundingBox();
				const row = await page
					.locator(section)
					.getByText(provider.name)
					.locator("xpath=..")
					.boundingBox();
				const contentWidth = isMobile ? MOBILE_CONTENT_WIDTH : 480 - 2 - 48;
				expect(box?.height).toBe(48);
				expect(box?.width).toBeCloseTo(contentWidth, 0);
				expect(box?.y).toBeCloseTo((row?.y ?? 0) + (row?.height ?? 0) + 12, 0);
				const style = await button.evaluate((element) => {
					const computed = getComputedStyle(element);
					const text = getComputedStyle(element.firstElementChild as Element);
					return {
						radius: computed.borderTopLeftRadius,
						background: computed.backgroundColor,
						fontSize: text.fontSize,
						fontWeight: text.fontWeight,
						color: text.color,
					};
				});
				expect(style.radius).toBe("12px");
				expect(sameColor(style.background, NEUTRAL_WEAK[theme])).toBe(true);
				expect(style.fontSize).toBe("15px");
				expect(style.fontWeight).toBe("700");
				expect(sameColor(style.color, token.fgNeutral)).toBe(true);
			});
		});
	}
}

// 커밋 6: 회원 탈퇴 영역 (A6)
// 기대값: 설계 문서 3절 S5 표(회원 탈퇴), 4절 문구, 5절 S5 동작, 2026-11-14 사용자 요청(약관과 정책 줄 삭제)
// 약관과 정책 줄은 푸터에 같은 링크가 있어 2026-11-14에 삭제함. 그래서 이 영역은 캔버스 S5MeMobile과 S5MeDesktop 보드와 다름(보드에는 아직 줄이 있음)
// 탈퇴 영역: 버튼 min-height 44, 13/18 밑줄 fg.neutralMuted, 설명 12/16 fg.neutralMuted, 간격 2. 모바일은 패딩 16 16 24로 푸터 바로 위, 데스크톱은 로그인 수단 카드 아래 24에 버튼 상자(좌우 4)가 옴
const WITHDRAW_TEXT = {
	withdraw: "회원 탈퇴",
	description: "탈퇴하면 계정과 대화 기록이 삭제돼요",
};
const REMOVED_POLICY_LABELS = ["이용약관", "개인정보처리방침", "데이터 출처"];
const WITHDRAW_BUTTON_HEIGHT = 44;
const WITHDRAW_AREA_HEIGHT = 16 + WITHDRAW_BUTTON_HEIGHT + 2 + 16 + 24;
const LAYER_BASEMENT = { light: "rgb(243, 244, 245)", dark: "rgb(0, 0, 0)" };

let a6Number = 1;

for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;
	const layout = isMobile ? "mobile" : "desktop";

	test.describe(`${label} ${viewport.width}x${viewport.height} 약관과 정책 줄 없음`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			process.env.TC_SESSION !== "in",
			"로그인 TC는 TC_SESSION=in일 때만 돌림",
		);

		test(`${caseId("A6", a6Number++)} ${label} 내 정보에 약관과 정책 섹션과 제목이 없고 정책 링크는 푸터에만 하나씩 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me");
			await expect(page.locator('[data-area^="policy-section"]')).toHaveCount(
				0,
			);
			await expect(
				page.getByRole("heading", { name: "약관과 정책" }),
			).toHaveCount(0);
			for (const name of REMOVED_POLICY_LABELS) {
				const links = page
					.getByRole("link", { name, exact: true })
					.locator("visible=true");
				await expect(links, name).toHaveCount(1);
				await expect(
					page
						.locator("footer:visible")
						.getByRole("link", { name, exact: true }),
					name,
				).toHaveCount(1);
			}
		});
	});

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 회원 탈퇴`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION !== "in",
				"로그인 TC는 TC_SESSION=in일 때만 돌림",
			);
			const token = TOKENS[theme];
			const provider = `[data-area="provider-section-${layout}"]`;
			const withdraw = `[data-area="withdraw-section-${layout}"]`;

			if (isMobile) {
				test(`${caseId("A6", a6Number++)} 모바일 ${theme} 로그인 수단 섹션 바로 아래에 8px bg.layerBasement 띠가 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const box = await page.locator(provider).boundingBox();
					const band = await page.evaluate(
						({ x, y }) => {
							const element = document.elementFromPoint(x, y);
							return element ? getComputedStyle(element).backgroundColor : "";
						},
						{
							x: viewport.width / 2,
							y: (box?.y ?? 0) + (box?.height ?? 0) + 4,
						},
					);
					expect(sameColor(band, LAYER_BASEMENT[theme])).toBe(true);
				});
			}

			test(`${caseId("A6", a6Number++)} ${label} ${theme} 회원 탈퇴 버튼이 높이 ${WITHDRAW_BUTTON_HEIGHT} 이상이고 글자가 13/18 밑줄 fg.neutralMuted이며 설명이 12/16 fg.neutralMuted로 아래 2에 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				const button = page
					.locator(withdraw)
					.getByRole("button", { name: WITHDRAW_TEXT.withdraw });
				await expect(button).toHaveCount(1);
				const box = await button.boundingBox();
				expect(box?.height).toBe(WITHDRAW_BUTTON_HEIGHT);
				const style = await button.evaluate((element) => {
					const text = getComputedStyle(element.firstElementChild as Element);
					return {
						fontSize: text.fontSize,
						lineHeight: text.lineHeight,
						decoration: text.textDecorationLine,
						color: text.color,
					};
				});
				expect(style.fontSize).toBe("13px");
				expect(style.lineHeight).toBe("18px");
				expect(style.decoration).toBe("underline");
				expect(sameColor(style.color, token.fgMuted)).toBe(true);
				const description = page
					.locator(withdraw)
					.getByText(WITHDRAW_TEXT.description, { exact: true });
				await expect(description).toHaveCount(1);
				const descriptionBox = await description.boundingBox();
				expect(descriptionBox?.x).toBeCloseTo(box?.x ?? 0, 0);
				expect(descriptionBox?.y).toBeCloseTo(
					(box?.y ?? 0) + (box?.height ?? 0) + 2,
					0,
				);
				expect(descriptionBox?.height).toBe(16);
				const descriptionStyle = await description.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						color: computed.color,
					};
				});
				expect(descriptionStyle.fontSize).toBe("12px");
				expect(descriptionStyle.lineHeight).toBe("16px");
				expect(sameColor(descriptionStyle.color, token.fgMuted)).toBe(true);
			});

			if (isMobile) {
				test(`${caseId("A6", a6Number++)} 모바일 ${theme} 탈퇴 영역이 카드 맨 아래이고 푸터 바로 위에 있고 높이 ${WITHDRAW_AREA_HEIGHT}에 패딩 16 16 24임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const area = await page.locator(withdraw).boundingBox();
					const footer = await page.locator("footer:visible").boundingBox();
					// 카드 아래 border 1을 건너 푸터가 바로 이어짐
					expect(
						(area?.y ?? 0) + (area?.height ?? 0) + CARD_BORDER,
					).toBeCloseTo(footer?.y ?? 0, 0);
					expect(area?.height).toBeCloseTo(WITHDRAW_AREA_HEIGHT, 0);
					expect(area?.width).toBe(CARD_INNER_WIDTH);
					const button = await page
						.locator(withdraw)
						.getByRole("button", { name: WITHDRAW_TEXT.withdraw })
						.boundingBox();
					expect(button?.x).toBe(CARD_INNER_X + 16);
					expect(button?.y).toBeCloseTo((area?.y ?? 0) + 16, 0);
				});
			} else {
				test(`${caseId("A6", a6Number++)} 데스크톱 ${theme} 로그인 수단 카드 아래 끝과 회원 탈퇴 버튼 상자 사이가 24이고 버튼이 열 왼쪽에서 4 안쪽에 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/me");
					const card = await page.locator(provider).boundingBox();
					const column = await page
						.locator('[data-area="me-column"]')
						.boundingBox();
					const button = await page
						.locator(withdraw)
						.getByRole("button", { name: WITHDRAW_TEXT.withdraw })
						.boundingBox();
					expect(button?.y).toBeCloseTo(
						(card?.y ?? 0) + (card?.height ?? 0) + 24,
						0,
					);
					expect(button?.x).toBeCloseTo((column?.x ?? 0) + 4, 0);
				});
			}
		});
	}
}

// 커밋 7: 로그아웃 (A7)
// 기대값: 설계 문서 5절 S5(로그아웃은 /api/auth/logout에 POST하는 폼의 제출 버튼)와 Route Handler 표. 버튼 모양은 A5와 같음
// 개발 환경에 백엔드(API_URL)가 없으므로 제출하면 502가 나는 것까지만 확인함. Origin이 없는 직접 POST는 403임
const LOGOUT_ACTION = "/api/auth/logout";

let a7Number = 1;

for (const { label, viewport } of SCREENS) {
	const layout = viewport === MOBILE ? "mobile" : "desktop";

	test.describe(`${label} ${viewport.width}x${viewport.height} 로그아웃`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			process.env.TC_SESSION !== "in",
			"로그인 TC는 TC_SESSION=in일 때만 돌림",
		);
		const section = `[data-area="provider-section-${layout}"]`;

		test(`${caseId("A7", a7Number++)} ${label} 로그아웃 버튼이 ${LOGOUT_ACTION}에 POST하는 폼의 제출 버튼임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me");
			const form = page.locator(section).locator("form");
			await expect(form).toHaveCount(1);
			await expect(form).toHaveAttribute("method", "post");
			await expect(form).toHaveAttribute("action", LOGOUT_ACTION);
			const button = form.getByRole("button", { name: ME_TEXT.logout });
			await expect(button).toHaveCount(1);
			await expect(button).toHaveAttribute("type", "submit");
		});

		test(`${caseId("A7", a7Number++)} ${label} 백엔드가 없을 때 로그아웃 폼을 제출하면 ${LOGOUT_ACTION}가 502를 반환함`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me");
			const responsePromise = page.waitForResponse(
				(response) =>
					new URL(response.url()).pathname === LOGOUT_ACTION &&
					response.request().method() === "POST",
			);
			await page
				.locator(section)
				.getByRole("button", { name: ME_TEXT.logout })
				.click();
			expect((await responsePromise).status()).toBe(502);
		});

		test(`${caseId("A7", a7Number++)} ${label} Origin이 없는 직접 POST는 ${LOGOUT_ACTION}가 403을 반환함`, async ({
			page,
		}) => {
			const response = await page.request.post(LOGOUT_ACTION, {
				maxRedirects: 0,
			});
			expect(response.status()).toBe(403);
		});
	});
}

// 커밋 8: 탈퇴 확인 창과 탈퇴 (A8)
// 기대값: 설계 문서 3절 "탈퇴 확인 창" 표와 5절 S5(Seed ResponsiveDialog, lg 미만 바텀시트, lg 이상 대화상자. 창 폭과 모서리는 Seed 기본값)
// 탈퇴하기 버튼 배경은 라이트 palette.red800(#CA1D13), 다크 palette.red500(#CA2319), 글자는 흰색임
// 설명과 버튼 사이는 컬럼 간격 8에 바텀시트 16, 대화상자 20이 더해짐
const WITHDRAW_ACTION = "/api/account/withdraw";
const WITHDRAW_DIALOG_TEXT = {
	title: "탈퇴할까요?",
	description: "탈퇴하면 계정과 대화 기록이 삭제돼요",
	cancel: "취소",
	confirm: "탈퇴하기",
};
const WITHDRAW_CONFIRM_BACKGROUND = {
	light: "rgb(202, 29, 19)",
	dark: "rgb(202, 35, 25)",
};
const WITHDRAW_BUTTON_ROW_HEIGHT = 52;

let a8Number = 1;

for (const { label, viewport } of SCREENS) {
	const isMobile = viewport === MOBILE;
	const layout = isMobile ? "mobile" : "desktop";

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 탈퇴 확인 창`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION !== "in",
				"로그인 TC는 TC_SESSION=in일 때만 돌림",
			);
			const token = TOKENS[theme];
			const trigger = `[data-area="withdraw-section-${layout}"]`;

			async function openDialog(page: Page) {
				await gotoAndSettle(page, "/me");
				await page
					.locator(trigger)
					.getByRole("button", { name: WITHDRAW_TEXT.withdraw })
					.click();
				const dialog = page.getByRole("dialog");
				await expect(dialog).toHaveCount(1);
				await page.waitForTimeout(700);
				return dialog;
			}

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 회원 탈퇴를 누르면 ${isMobile ? "화면 아래에 붙은 바텀시트" : "화면 가운데 대화상자"}가 role=dialog, aria-modal로 열림`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				await expect(dialog).toBeVisible();
				await expect(dialog).toHaveAttribute("aria-modal", "true");
				const box = await dialog.boundingBox();
				if (isMobile) {
					expect((box?.y ?? 0) + (box?.height ?? 0)).toBeCloseTo(
						viewport.height,
						0,
					);
					expect(box?.width).toBe(viewport.width);
				} else {
					expect(box?.width).toBe(480);
					expect((box?.x ?? 0) + (box?.width ?? 0) / 2).toBeCloseTo(
						viewport.width / 2,
						0,
					);
					expect((box?.y ?? 0) + (box?.height ?? 0) / 2).toBeCloseTo(
						viewport.height / 2,
						0,
					);
				}
			});

			if (isMobile) {
				test(`${caseId("A8", a8Number++)} ${label} ${theme} 바텀시트가 하단 내비게이션 위에 뜸`, async ({
					page,
				}) => {
					await openDialog(page);
					const nav = await page
						.locator('[data-area="bottom-nav"]')
						.boundingBox();
					const hitsNav = await page.evaluate(
						({ x, y }) =>
							!!document
								.elementFromPoint(x, y)
								?.closest('[data-area="bottom-nav"]'),
						{
							x: viewport.width / 2,
							y: (nav?.y ?? 0) + (nav?.height ?? 0) / 2,
						},
					);
					expect(hitsNav).toBe(false);
				});
			}

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 제목이 20/27 700 fg.neutral이고 설명이 15/22 fg.neutralMuted로 제목 아래 8에 있으며 줄바꿈이 keep-all임`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				const title = dialog.getByRole("heading", {
					name: WITHDRAW_DIALOG_TEXT.title,
					exact: true,
				});
				await expect(title).toHaveCount(1);
				const description = dialog.getByText(WITHDRAW_DIALOG_TEXT.description, {
					exact: true,
				});
				await expect(description).toHaveCount(1);
				const titleStyle = await title.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						fontWeight: computed.fontWeight,
						color: computed.color,
					};
				});
				expect(titleStyle.fontSize).toBe("20px");
				expect(titleStyle.lineHeight).toBe("27px");
				expect(titleStyle.fontWeight).toBe("700");
				expect(sameColor(titleStyle.color, token.fgNeutral)).toBe(true);
				const descriptionStyle = await description.evaluate((element) => {
					const computed = getComputedStyle(element);
					return {
						fontSize: computed.fontSize,
						lineHeight: computed.lineHeight,
						color: computed.color,
					};
				});
				expect(descriptionStyle.fontSize).toBe("15px");
				expect(descriptionStyle.lineHeight).toBe("22px");
				expect(sameColor(descriptionStyle.color, token.fgMuted)).toBe(true);
				const titleBox = await title.boundingBox();
				const descriptionBox = await description.boundingBox();
				expect(descriptionBox?.y).toBeCloseTo(
					(titleBox?.y ?? 0) + (titleBox?.height ?? 0) + 8,
					0,
				);
				const wordBreak = await dialog.evaluate(
					(element) => getComputedStyle(element).wordBreak,
				);
				expect(wordBreak).toBe("keep-all");
			});

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 버튼이 2열 간격 8, 높이 ${WITHDRAW_BUTTON_ROW_HEIGHT}, 모서리 12이고 설명 아래 ${isMobile ? 24 : 28}에 있음`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				const cancel = dialog.getByRole("button", {
					name: WITHDRAW_DIALOG_TEXT.cancel,
					exact: true,
				});
				const confirm = dialog.getByRole("button", {
					name: WITHDRAW_DIALOG_TEXT.confirm,
					exact: true,
				});
				await expect(cancel).toHaveCount(1);
				await expect(confirm).toHaveCount(1);
				const cancelBox = await cancel.boundingBox();
				const confirmBox = await confirm.boundingBox();
				expect(cancelBox?.height).toBe(WITHDRAW_BUTTON_ROW_HEIGHT);
				expect(confirmBox?.height).toBe(WITHDRAW_BUTTON_ROW_HEIGHT);
				expect(cancelBox?.width).toBeCloseTo(confirmBox?.width ?? 0, 0);
				expect(confirmBox?.x).toBeCloseTo(
					(cancelBox?.x ?? 0) + (cancelBox?.width ?? 0) + 8,
					0,
				);
				expect(confirmBox?.y).toBeCloseTo(cancelBox?.y ?? 0, 0);
				for (const button of [cancel, confirm]) {
					const radius = await button.evaluate(
						(element) => getComputedStyle(element).borderTopLeftRadius,
					);
					expect(radius).toBe("12px");
				}
				const description = await dialog
					.getByText(WITHDRAW_DIALOG_TEXT.description, { exact: true })
					.boundingBox();
				expect(cancelBox?.y).toBeCloseTo(
					(description?.y ?? 0) +
						(description?.height ?? 0) +
						(isMobile ? 24 : 28),
					0,
				);
			});

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 취소는 bg.neutralWeak에 fg.neutral, 탈퇴하기는 ${theme === "light" ? "palette.red800" : "palette.red500"}에 흰 글자이고 둘 다 16 700임`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				const cancel = dialog.getByRole("button", {
					name: WITHDRAW_DIALOG_TEXT.cancel,
					exact: true,
				});
				const confirm = dialog.getByRole("button", {
					name: WITHDRAW_DIALOG_TEXT.confirm,
					exact: true,
				});
				const read = (element: Element) => {
					const text = getComputedStyle(element.firstElementChild as Element);
					return {
						background: getComputedStyle(element).backgroundColor,
						color: text.color,
						fontSize: text.fontSize,
						fontWeight: text.fontWeight,
					};
				};
				const cancelStyle = await cancel.evaluate(read);
				const confirmStyle = await confirm.evaluate(read);
				expect(sameColor(cancelStyle.background, NEUTRAL_WEAK[theme])).toBe(
					true,
				);
				expect(sameColor(cancelStyle.color, token.fgNeutral)).toBe(true);
				expect(
					sameColor(
						confirmStyle.background,
						WITHDRAW_CONFIRM_BACKGROUND[theme],
					),
				).toBe(true);
				expect(sameColor(confirmStyle.color, "rgb(255, 255, 255)")).toBe(true);
				for (const style of [cancelStyle, confirmStyle]) {
					expect(style.fontSize).toBe("16px");
					expect(style.fontWeight).toBe("700");
				}
			});

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 취소를 누르면 창이 닫힘`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				await dialog
					.getByRole("button", {
						name: WITHDRAW_DIALOG_TEXT.cancel,
						exact: true,
					})
					.click();
				await expect(page.getByRole("dialog")).toHaveCount(0);
			});

			test(`${caseId("A8", a8Number++)} ${label} ${theme} Esc를 누르면 창이 닫힘(Seed 기본 동작)`, async ({
				page,
			}) => {
				await openDialog(page);
				await page.keyboard.press("Escape");
				await expect(page.getByRole("dialog")).toHaveCount(0);
			});

			test(`${caseId("A8", a8Number++)} ${label} ${theme} 탈퇴하기가 ${WITHDRAW_ACTION}에 POST하는 폼 안의 제출 버튼임`, async ({
				page,
			}) => {
				const dialog = await openDialog(page);
				const form = dialog.locator("form");
				await expect(form).toHaveCount(1);
				await expect(form).toHaveAttribute("method", "post");
				await expect(form).toHaveAttribute("action", WITHDRAW_ACTION);
				const confirm = form.getByRole("button", {
					name: WITHDRAW_DIALOG_TEXT.confirm,
					exact: true,
				});
				await expect(confirm).toHaveCount(1);
				await expect(confirm).toHaveAttribute("type", "submit");
			});
		});
	}
}

test.describe("탈퇴 확인 창 요청", () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });
	test.skip(
		process.env.TC_SESSION !== "in",
		"로그인 TC는 TC_SESSION=in일 때만 돌림",
	);

	test(`${caseId("A8", a8Number++)} 백엔드가 없을 때 탈퇴하기를 누르면 ${WITHDRAW_ACTION}가 502를 반환함`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/me");
		await page
			.locator('[data-area="withdraw-section-mobile"]')
			.getByRole("button", { name: WITHDRAW_TEXT.withdraw })
			.click();
		const responsePromise = page.waitForResponse(
			(response) =>
				new URL(response.url()).pathname === WITHDRAW_ACTION &&
				response.request().method() === "POST",
		);
		await page
			.getByRole("dialog")
			.getByRole("button", { name: WITHDRAW_DIALOG_TEXT.confirm, exact: true })
			.click();
		expect((await responsePromise).status()).toBe(502);
	});

	test(`${caseId("A8", a8Number++)} Origin이 없는 직접 POST는 ${WITHDRAW_ACTION}가 403을 반환함`, async ({
		page,
	}) => {
		const response = await page.request.post(WITHDRAW_ACTION, {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(403);
	});
});

// 커밋 9: 화면 폭이 lg(1280) 경계를 넘으면 열려 있던 확인 창이 닫히고, 다시 열면 넘은 쪽 모양으로 열림 (A8)
const LG_BELOW = { width: 1279, height: 900 };
const LG_ABOVE = { width: 1280, height: 900 };

for (const theme of THEMES) {
	test.describe(`${theme} 탈퇴 확인 창 lg 경계`, () => {
		test.use({ viewport: LG_BELOW, colorScheme: theme });
		test.skip(
			process.env.TC_SESSION !== "in",
			"로그인 TC는 TC_SESSION=in일 때만 돌림",
		);

		async function clickWithdraw(page: Page) {
			await page
				.getByRole("button", { name: WITHDRAW_TEXT.withdraw, exact: true })
				.click();
			const dialog = page.getByRole("dialog");
			await expect(dialog).toHaveCount(1);
			await page.waitForTimeout(700);
			return dialog;
		}

		test(`${caseId("A8", a8Number++)} ${theme} 1279에서 연 바텀시트가 1280으로 넘으면 닫히고, 다시 열면 가운데 대화상자임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me");
			const sheet = await clickWithdraw(page);
			const sheetBox = await sheet.boundingBox();
			expect((sheetBox?.y ?? 0) + (sheetBox?.height ?? 0)).toBeCloseTo(
				LG_BELOW.height,
				0,
			);
			await page.setViewportSize(LG_ABOVE);
			await expect(page.getByRole("dialog")).toHaveCount(0);
			const dialog = await clickWithdraw(page);
			await expect(dialog).toBeVisible();
			const box = await dialog.boundingBox();
			expect(box?.width).toBe(480);
			expect((box?.x ?? 0) + (box?.width ?? 0) / 2).toBeCloseTo(
				LG_ABOVE.width / 2,
				0,
			);
			expect((box?.y ?? 0) + (box?.height ?? 0) / 2).toBeCloseTo(
				LG_ABOVE.height / 2,
				0,
			);
		});

		test(`${caseId("A8", a8Number++)} ${theme} 1280에서 연 대화상자가 1279로 넘으면 닫히고, 다시 열면 화면 아래 바텀시트임`, async ({
			page,
		}) => {
			await page.setViewportSize(LG_ABOVE);
			await gotoAndSettle(page, "/me");
			const dialog = await clickWithdraw(page);
			const dialogBox = await dialog.boundingBox();
			expect((dialogBox?.y ?? 0) + (dialogBox?.height ?? 0) / 2).toBeCloseTo(
				LG_ABOVE.height / 2,
				0,
			);
			await page.setViewportSize(LG_BELOW);
			await expect(page.getByRole("dialog")).toHaveCount(0);
			const sheet = await clickWithdraw(page);
			await expect(sheet).toBeVisible();
			const box = await sheet.boundingBox();
			expect((box?.y ?? 0) + (box?.height ?? 0)).toBeCloseTo(
				LG_BELOW.height,
				0,
			);
		});
	});
}

// 탈퇴 확인 창의 딤은 sticky 헤더, 푸터, 하단 내비게이션, 양옆 하늘빛 배경까지 덮어야 함
for (const viewport of [MOBILE, { width: 768, height: 1024 }, DESKTOP]) {
	for (const theme of THEMES) {
		test.describe(`${viewport.width}x${viewport.height} ${theme} 탈퇴 확인 창 딤`, () => {
			test.use({ viewport, colorScheme: theme });
			test.skip(
				process.env.TC_SESSION !== "in",
				"로그인 TC는 TC_SESSION=in일 때만 돌림",
			);

			test(`${caseId("A8", a8Number++)} ${viewport.width} ${theme} 확인 창이 열리면 딤이 헤더와 ${viewport === DESKTOP ? "양옆 하늘빛 배경" : "푸터와 하단 내비게이션"}까지 덮음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/me");
				await page
					.getByRole("button", { name: WITHDRAW_TEXT.withdraw, exact: true })
					.click();
				await expect(page.getByRole("dialog")).toHaveCount(1);
				await page.waitForTimeout(700);
				expect(await isDimmedAt(page, viewport.width / 2, 10)).toBe(true);
				expect(await isDimmedAt(page, 5, 10)).toBe(true);
				if (viewport === DESKTOP) {
					expect(await isDimmedAt(page, 5, viewport.height / 2)).toBe(true);
					return;
				}
				expect(await isDimmedAt(page, 5, viewport.height - 10)).toBe(true);
				expect(
					await isDimmedAt(page, 5, viewport.height - BOTTOM_NAV_HEIGHT - 10),
				).toBe(true);
			});
		});
	}
}
