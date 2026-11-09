// S4 로그인, S5 내 정보 UI TC
// 기대값: 설계 문서(2026-11-08-s4-s5-account-design.md) 5절의 로그인 링크 표와 캔버스 S4, S5 보드. 2026-11-09 피드백이 설계 문서와 다르면 피드백을 따름
// 로그인한 상태의 TC는 앱의 sessionMock이 { provider: "GOOGLE" } 같은 값일 때만 의미가 있어 TC_SESSION=in일 때만 돌림. 기본 실행은 로그아웃 TC만 돎
import { expect } from "@playwright/test";
import { sameColor } from "./support/buildingDetail/sameColor";
import { TOKENS } from "./support/buildingDetail/tokens";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { test } from "./support/test";
import { DESKTOP, MOBILE } from "./support/viewports";

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
	test.describe(`${label} ${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			process.env.TC_SESSION === "in",
			"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
		);

		const base = screenIndex * (HEADER_LOGIN_CASES.length + 2);

		for (const [index, { what, path, href }] of HEADER_LOGIN_CASES.entries()) {
			test(`${caseId("A1", base + index + 1)} ${label} ${what} 헤더 로그인 링크가 ${href}임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, path);
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
// 커밋 3부터 로고 묶음 아래 32 간격으로 제공자 버튼 묶음(52 3개와 간격 10 2개)이 붙음. 커밋 4가 고지 묶음을 더하면 이 값을 고침
const PROVIDER_LIST_HEIGHT = 176;
const CONTENT_HEIGHT = INTRO_HEIGHT + 32 + PROVIDER_LIST_HEIGHT;
const LOGO_SIZE = 64;
const THEMES = ["light", "dark"] as const;
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
				await expect(
					page.getByRole("link", { name: "로그인", exact: true }),
				).toHaveCount(0);
				const header = page.getByTestId(
					isMobile ? "header-mobile" : "header-desktop",
				);
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
					// 세로는 패딩 32 16 24를 뺀 영역 가운데에 로고 묶음부터 버튼 묶음까지가 놓임
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
							return {
								background: computed.backgroundColor,
								border: computed.borderTopWidth,
								borderColor: computed.borderTopColor,
								text: computed.color,
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
