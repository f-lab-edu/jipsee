// 오류 화면, 404, 요청 제한(429), 폼 전송 실패 안내 UI TC
// 기대값: 설계 문서(2026-11-14-error-and-paging-design.md) 3, 4절과 캔버스 "오류와 404" 페이지의 Err* 보드. 미정 항목(7절)은 추천안을 따름
// 백엔드가 없어 실제 429와 호출 실패를 만들 곳이 없음. 일부 실패와 요청 제한 TC는 쿠키 jipsee-mock-building(TC_BUILDING_FAILURE가 mockStorageState로 넣음)이 같은 값일 때만 돎. 기본값은 none
// 폼 실패 안내 TC는 로그인한 상태(TC_SESSION=in, 쿠키 jipsee-mock-session)에서만 돌림. 그 밖의 TC는 로그인 여부와 상관없이 돎
import { expect } from "@playwright/test";
import { sameColor } from "./support/buildingDetail/sameColor";
import { TOKENS } from "./support/buildingDetail/tokens";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { readBox } from "./support/policy/readBox";
import { readStyle } from "./support/policy/readStyle";
import { test } from "./support/test";
import { DESKTOP, MOBILE } from "./support/viewports";

const SCREENS = [
	{ label: "모바일", viewport: MOBILE, layout: "mobile" },
	{ label: "데스크톱", viewport: DESKTOP, layout: "desktop" },
] as const;
const THEMES = ["light", "dark"] as const;
const LOGGED_IN = process.env.TC_SESSION === "in";
const FAILURE = process.env.TC_BUILDING_FAILURE ?? "none";

const COPY = {
	notFoundTitle: "페이지를 찾을 수 없어요",
	notFoundDescription: "주소가 바르지 않거나 삭제된 페이지예요",
	errorTitle: "일시적인 오류가 발생했어요",
	rateTitle: "요청이 많아요. 잠시 후 다시 시도해 주세요",
	home: "홈으로 가기",
	retry: "다시 시도",
	logoutFailed: "로그아웃하지 못했어요. 다시 시도해 주세요",
	withdrawFailed: "탈퇴하지 못했어요. 다시 시도해 주세요",
	chatDeleteFailed: "대화를 삭제하지 못했어요. 다시 시도해 주세요",
};

// 브랜드 채움 버튼 배경: 라이트 palette.blue800(#135FCD), 다크 palette.blue500(#1964D8)
const BRAND_BUTTON = { light: "rgb(19, 95, 205)", dark: "rgb(25, 100, 216)" };
const NEUTRAL_WEAK = { light: "rgb(243, 244, 245)", dark: "rgb(43, 46, 53)" };
const CRITICAL_WEAK = { light: "rgb(254, 241, 240)", dark: "rgb(54, 22, 22)" };
// 하늘빛 배경(본문 body)과 데스크톱 카드 모서리 20
const CARD = { width: 480, radius: "20px" };

// Next가 라우트 이동을 알리려고 넣는 빈 role="alert" 요소가 있어 띠는 data-area로 찾음
const BANNER = '[data-area="form-error-banner"]';
const LOGOUT_ACTION = "/api/auth/logout";
const WITHDRAW_ACTION = "/api/account/withdraw";
const CHAT_DELETE_ACTION = "/api/chat/1/delete";

let e1Number = 1;
let e2Number = 1;
let e3Number = 1;
let e4Number = 1;
let e5Number = 1;

// E1: 404 화면. 없는 주소와 notFound()를 던진 화면 모두 같은 화면이고 헤더, 푸터, 하단 내비게이션이 남음
// 건물 상세 경로는 목업 스위치가 none일 때만 404임
const NOT_FOUND_PATHS =
	FAILURE === "none"
		? ["/nope", "/buildings/999", "/buildings/abc"]
		: ["/nope"];

for (const { label, viewport, layout } of SCREENS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} 404 화면`, () => {
		test.use({ viewport, colorScheme: "light" });

		for (const path of NOT_FOUND_PATHS) {
			test(`${caseId("E1", e1Number++)} ${label} ${path}는 404이고 제목, 설명, 홈으로 가기 링크가 나옴`, async ({
				page,
			}) => {
				expect(await gotoAndSettle(page, path, 300)).toBe(404);
				const status = page.getByTestId(`status-${layout}`);
				await expect(status.getByRole("heading", { level: 1 })).toHaveText(
					COPY.notFoundTitle,
				);
				await expect(status.getByText(COPY.notFoundDescription)).toBeVisible();
				const home = status.getByRole("link", { name: COPY.home });
				await expect(home).toHaveAttribute("href", "/");
				await expect(status.getByRole("button")).toHaveCount(0);
				// notFound()를 던진 페이지는 그 페이지의 메타데이터가 제목을 정하므로 없는 주소만 확인함
				if (path === "/nope") {
					await expect(page).toHaveTitle(`${COPY.notFoundTitle} | 집씨`);
				}
			});
		}

		test(`${caseId("E1", e1Number++)} ${label} 404 화면에 헤더와 푸터가 있고 모바일은 하단 내비게이션에 활성 탭이 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/nope", 300);
			await expect(page.getByTestId(`header-${layout}`)).toBeVisible();
			await expect(page.getByTestId(`footer-${layout}`)).toBeVisible();
			if (layout === "mobile") {
				const nav = page.locator('[data-area="bottom-nav"]');
				await expect(nav).toBeVisible();
				await expect(nav.locator("[aria-current]")).toHaveCount(0);
			}
		});

		test(`${caseId("E1", e1Number++)} ${label} 홈으로 가기를 누르면 홈으로 이동함`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/nope", 300);
			await page
				.getByTestId(`status-${layout}`)
				.getByRole("link", { name: COPY.home })
				.click();
			await expect(page).toHaveURL(/\/$/);
		});
	});

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme} 404 화면 치수와 색`, () => {
			test.use({ viewport, colorScheme: theme });

			test(`${caseId("E1", e1Number++)} ${label} ${theme} 아이콘 원 ${layout === "mobile" ? 72 : 80}, 제목 ${layout === "mobile" ? 20 : 22}/700, 버튼 280x48 모서리 12가 시안과 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/nope", 300);
				const status = page.getByTestId(`status-${layout}`);
				const circle = status
					.locator('[data-area="status-notfound"] > div')
					.first();
				const circleBox = await readBox(circle);
				const size = layout === "mobile" ? 72 : 80;
				expect.soft(circleBox.width, "원 폭").toBe(size);
				expect.soft(circleBox.height, "원 높이").toBe(size);
				expect
					.soft(
						sameColor(
							(await readStyle(circle, ["background-color"]))[
								"background-color"
							],
							NEUTRAL_WEAK[theme],
						),
						"원 배경",
					)
					.toBe(true);
				const title = await readStyle(
					status.getByRole("heading", { level: 1 }),
					["font-size", "font-weight", "color", "line-height"],
				);
				expect
					.soft(title["font-size"], "제목 크기")
					.toBe(layout === "mobile" ? "20px" : "22px");
				expect.soft(title["font-weight"], "제목 굵기").toBe("700");
				expect
					.soft(sameColor(title.color, TOKENS[theme].fgNeutral), "제목 색")
					.toBe(true);
				const button = status.getByRole("link", { name: COPY.home });
				const buttonBox = await readBox(button);
				expect.soft(buttonBox.width, "버튼 폭").toBe(280);
				expect.soft(buttonBox.height, "버튼 높이").toBe(48);
				const buttonStyle = await readStyle(button, [
					"background-color",
					"border-top-left-radius",
				]);
				expect
					.soft(
						sameColor(buttonStyle["background-color"], BRAND_BUTTON[theme]),
						"버튼 배경",
					)
					.toBe(true);
				expect
					.soft(buttonStyle["border-top-left-radius"], "버튼 모서리")
					.toBe("12px");
				if (layout === "desktop") {
					const card = status
						.locator('[data-area="status-notfound"]')
						.locator("..");
					const cardBox = await readBox(card);
					expect.soft(cardBox.width, "카드 폭").toBe(CARD.width);
					expect
						.soft(
							(await readStyle(card, ["border-top-left-radius"]))[
								"border-top-left-radius"
							],
							"카드 모서리",
						)
						.toBe(CARD.radius);
				}
			});
		});
	}
}

// E2: 일반 오류와 요청 제한 화면. error.tsx는 예상하지 못한 실패, 429는 데이터 계층이 상태 값으로 돌려준 요청 제한
// buildingFailed는 건물 상세 조회가 실패해 화면 전체가 일반 오류로 바뀌고, buildingRateLimited는 본문만 요청 제한 안내로 바뀜
for (const { label, viewport, layout } of SCREENS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} 건물 상세 조회 실패`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			FAILURE !== "buildingFailed",
			"TC_BUILDING_FAILURE=buildingFailed일 때만 돌림",
		);

		test(`${caseId("E2", e2Number++)} ${label} 조회가 실패하면 헤더, 푸터는 남고 일반 오류 화면에 다시 시도와 홈으로 가기가 나옴`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/buildings/1", 500);
			const status = page.getByTestId(`status-${layout}`);
			await expect(status.getByRole("heading", { level: 1 })).toHaveText(
				COPY.errorTitle,
			);
			await expect(
				status.getByRole("button", { name: COPY.retry }),
			).toBeVisible();
			await expect(
				status.getByRole("link", { name: COPY.home }),
			).toHaveAttribute("href", "/");
			await expect(page.getByTestId(`header-${layout}`)).toBeVisible();
			await expect(page.getByTestId(`footer-${layout}`)).toBeVisible();
		});

		test(`${caseId("E2", e2Number++)} ${label} 다시 시도를 눌러도 계속 실패하면 같은 오류 화면이 다시 나오고 버튼이 다시 눌림`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/buildings/1", 500);
			const retry = page
				.getByTestId(`status-${layout}`)
				.getByRole("button", { name: COPY.retry });
			await retry.click();
			await page.waitForTimeout(800);
			await expect(retry).toBeVisible();
			await expect(retry).toBeEnabled();
			await expect(retry).toHaveAttribute("aria-busy", "false");
		});
	});

	test.describe(`${label} ${viewport.width}x${viewport.height} 건물 상세 요청 제한`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(
			FAILURE !== "buildingRateLimited",
			"TC_BUILDING_FAILURE=buildingRateLimited일 때만 돌림",
		);

		test(`${caseId("E2", e2Number++)} ${label} 요청 제한이면 본문만 요청 제한 안내로 바뀌고 헤더, 질문 바, 푸터는 남음`, async ({
			page,
		}) => {
			expect(await gotoAndSettle(page, "/buildings/1", 500)).toBe(200);
			const partial = page.getByTestId(`partial-status-${layout}`);
			await expect(partial.getByRole("alert")).toHaveText(COPY.rateTitle);
			await expect(
				partial.getByRole("button", { name: COPY.retry }),
			).toBeVisible();
			await expect(page.getByTestId(`header-${layout}`)).toBeVisible();
			await expect(page.getByTestId(`footer-${layout}`)).toBeVisible();
			if (layout === "mobile") {
				await expect(
					page.locator('[data-area="ask-building-bar"]'),
				).toBeVisible();
			}
			// 건물 정보는 그리지 않음
			await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0);
		});
	});
}

// E3: 검색 결과 영역만 실패. 검색창과 기준 월 안내는 그대로임
const SEARCH_FAILURES = [
	{ failure: "searchFailed", area: "inline-server", title: COPY.errorTitle },
	{ failure: "searchRateLimited", area: "inline-rate", title: COPY.rateTitle },
] as const;

for (const { label, viewport, layout } of SCREENS) {
	for (const { failure, area, title } of SEARCH_FAILURES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} 검색 ${failure}`, () => {
			test.use({ viewport, colorScheme: "light" });
			test.skip(
				FAILURE !== failure,
				`TC_BUILDING_FAILURE=${failure}일 때만 돌림`,
			);

			test(`${caseId("E3", e3Number++)} ${label} 결과 영역만 ${title}로 바뀌고 검색창은 그대로임`, async ({
				page,
			}) => {
				expect(await gotoAndSettle(page, "/search?keyword=망원", 500)).toBe(
					200,
				);
				const partial = page.getByTestId(`partial-status-${layout}`);
				await expect(partial.locator(`[data-area="${area}"]`)).toBeVisible();
				await expect(partial.getByRole("alert")).toHaveText(title);
				await expect(
					partial.getByRole("button", { name: COPY.retry }),
				).toBeVisible();
				await expect(page.getByTestId("search-result-mobile")).toHaveCount(0);
				await expect(page.getByTestId("search-result-desktop")).toHaveCount(0);
				const input = page.locator('input[name="keyword"]:visible').first();
				await expect(input).toHaveValue("망원");
			});

			test(`${caseId("E3", e3Number++)} ${label} 아이콘 원 ${layout === "mobile" ? 72 : 80}, 제목 17/700, 다시 시도 버튼 높이 44 모서리 12가 시안과 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/search?keyword=망원", 500);
				const partial = page.getByTestId(`partial-status-${layout}`);
				const circle = partial.locator(`[data-area="${area}"] > div`).first();
				const circleBox = await readBox(circle);
				const size = layout === "mobile" ? 72 : 80;
				expect.soft(circleBox.width, "원 폭").toBe(size);
				expect.soft(circleBox.height, "원 높이").toBe(size);
				const titleStyle = await readStyle(partial.getByRole("alert"), [
					"font-size",
					"font-weight",
					"line-height",
				]);
				expect.soft(titleStyle["font-size"], "제목 크기").toBe("17px");
				expect.soft(titleStyle["font-weight"], "제목 굵기").toBe("700");
				expect.soft(titleStyle["line-height"], "제목 줄 높이").toBe("24px");
				const button = partial.getByRole("button", { name: COPY.retry });
				const buttonBox = await readBox(button);
				expect.soft(buttonBox.height, "버튼 높이").toBe(44);
				expect
					.soft(
						(await readStyle(button, ["border-top-left-radius"]))[
							"border-top-left-radius"
						],
						"버튼 모서리",
					)
					.toBe("12px");
				// 원 아래 20, 제목 아래 20
				const titleBox = await readBox(partial.getByRole("alert"));
				expect
					.soft(titleBox.y - (circleBox.y + circleBox.height), "원과 제목 간격")
					.toBe(20);
				expect
					.soft(
						buttonBox.y - (titleBox.y + titleBox.height),
						"제목과 버튼 간격",
					)
					.toBe(20);
			});
		});
	}
}

// 기본 상태(none)에서는 검색과 건물 상세가 정상 화면이고 실패 안내가 없음
test.describe("기본 상태에서는 실패 안내가 없음", () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });
	test.skip(FAILURE !== "none", "TC_BUILDING_FAILURE가 none일 때만 돌림");

	test(`${caseId("E3", e3Number++)} 검색 결과와 건물 상세에 실패 안내가 없음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/search?keyword=망원", 300);
		await expect(
			page.getByTestId("partial-status-mobile").getByRole("alert"),
		).toHaveCount(0);
		await gotoAndSettle(page, "/buildings/1", 300);
		await expect(
			page.getByTestId("partial-status-mobile").getByRole("alert"),
		).toHaveCount(0);
		await expect(page.getByTestId("status-mobile")).toHaveCount(0);
	});
});

// E4: 폼 전송 실패. 일반 텍스트 응답 대신 폼을 보낸 화면으로 303 이동하고 error 쿼리를 붙임. 백엔드가 없어 폼을 보내면 항상 실패함
test.describe("폼 전송 실패 응답", () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`${caseId("E4", e4Number++)} Origin이 없는 로그아웃 POST는 /me?error=logout-failed로 303을 반환함`, async ({
		page,
	}) => {
		const response = await page.request.post(LOGOUT_ACTION, {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(303);
		expect(response.headers().location).toBe("/me?error=logout-failed");
	});

	test(`${caseId("E4", e4Number++)} Origin이 없는 탈퇴 POST는 /me?error=withdraw-failed로 303을 반환함`, async ({
		page,
	}) => {
		const response = await page.request.post(WITHDRAW_ACTION, {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(303);
		expect(response.headers().location).toBe("/me?error=withdraw-failed");
	});

	test(`${caseId("E4", e4Number++)} Origin이 없는 대화 삭제 POST는 /chat/history?error=chat-delete-failed로 303을 반환함`, async ({
		page,
	}) => {
		const response = await page.request.post(CHAT_DELETE_ACTION, {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(303);
		expect(response.headers().location).toBe(
			"/chat/history?error=chat-delete-failed",
		);
	});

	test(`${caseId("E4", e4Number++)} 번호가 양의 정수가 아닌 대화 삭제 POST는 404를 반환함`, async ({
		page,
	}) => {
		const response = await page.request.post("/api/chat/abc/delete", {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(404);
	});
});

// E5: 실패 안내 띠. 로그인한 상태에서 error 쿼리가 허용된 코드일 때만 띠가 나오고, 화면이 뜨면 주소에서 쿼리를 지움
const ME_ERRORS = [
	{ code: "logout-failed", text: COPY.logoutFailed },
	{ code: "withdraw-failed", text: COPY.withdrawFailed },
] as const;

for (const { label, viewport, layout } of SCREENS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} 내 정보 실패 안내`, () => {
		test.use({ viewport, colorScheme: "light" });
		test.skip(!LOGGED_IN, "로그인 TC는 TC_SESSION=in일 때만 돌림");

		for (const { code, text } of ME_ERRORS) {
			test(`${caseId("E5", e5Number++)} ${label} /me?error=${code}이면 띠에 "${text}"가 나오고 주소에서 error 쿼리가 지워짐`, async ({
				page,
			}) => {
				await gotoAndSettle(page, `/me?error=${code}`, 500);
				const banner = page.getByTestId(`me-body-${layout}`).getByRole("alert");
				await expect(banner).toHaveText(text);
				expect(new URL(page.url()).search).toBe("");
				await page.reload();
				await expect(page.locator(BANNER)).toHaveCount(0);
			});
		}

		test(`${caseId("E5", e5Number++)} ${label} 모르는 코드와 다른 화면의 코드는 띠를 보이지 않음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me?error=unknown", 300);
			await expect(page.locator(BANNER)).toHaveCount(0);
			await gotoAndSettle(page, "/me?error=chat-delete-failed", 300);
			await expect(page.locator(BANNER)).toHaveCount(0);
		});

		test(`${caseId("E5", e5Number++)} ${label} 띠는 최소 높이 50, 모서리 12, 배경 critical weak이고 ${layout === "mobile" ? "제목 위 좌우 16, 위 16" : "제목 아래 카드 위"}에 놓임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me?error=logout-failed", 500);
			const body = page.getByTestId(`me-body-${layout}`);
			const banner = body.getByRole("alert");
			const bannerBox = await readBox(banner);
			expect.soft(bannerBox.height, "띠 높이").toBeGreaterThanOrEqual(50);
			const style = await readStyle(banner, [
				"background-color",
				"border-top-left-radius",
			]);
			expect
				.soft(
					sameColor(style["background-color"], CRITICAL_WEAK.light),
					"띠 배경",
				)
				.toBe(true);
			expect.soft(style["border-top-left-radius"], "띠 모서리").toBe("12px");
			const titleBox = await readBox(body.getByRole("heading", { level: 1 }));
			if (layout === "mobile") {
				expect.soft(bannerBox.x, "띠 왼쪽").toBe(16);
				expect.soft(bannerBox.width, "띠 폭").toBe(358);
				expect.soft(bannerBox.y, "띠 위치").toBeLessThan(titleBox.y);
				return;
			}
			expect.soft(bannerBox.width, "띠 폭").toBe(480);
			expect.soft(bannerBox.y, "띠 위치").toBeGreaterThan(titleBox.y);
			const cardBox = await readBox(
				body.locator('[data-area="provider-section-desktop"]'),
			);
			expect
				.soft(cardBox.y, "카드는 띠 아래")
				.toBeGreaterThan(bannerBox.y + bannerBox.height);
		});

		test(`${caseId("E5", e5Number++)} ${label} 로그아웃 폼을 제출하면 /me에 로그아웃 실패 띠가 나오고 error 쿼리는 지워짐`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me", 500);
			await page
				.getByTestId(`me-body-${layout}`)
				.getByRole("button", { name: "로그아웃" })
				.click();
			await expect(page.locator(BANNER).first()).toHaveText(COPY.logoutFailed);
			await expect(page).toHaveURL(/\/me$/);
		});

		test(`${caseId("E5", e5Number++)} ${label} 탈퇴하기를 누르면 /me에 탈퇴 실패 띠가 나옴`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/me", 500);
			await page
				.getByTestId(`me-body-${layout}`)
				.getByRole("button", { name: "회원 탈퇴" })
				.click();
			await page
				.getByRole("dialog")
				.getByRole("button", { name: "탈퇴하기", exact: true })
				.click();
			await expect(page.locator(BANNER).first()).toHaveText(
				COPY.withdrawFailed,
			);
			await expect(page).toHaveURL(/\/me$/);
		});
	});
}

test.describe("대화 삭제 실패 안내", () => {
	test.skip(!LOGGED_IN, "로그인 TC는 TC_SESSION=in일 때만 돌림");

	test.describe("모바일 대화 목록", () => {
		test.use({ viewport: MOBILE, colorScheme: "light" });

		test(`${caseId("E5", e5Number++)} /chat/history?error=chat-delete-failed이면 제목 아래 목록 위에 띠가 나오고 주소에서 error 쿼리가 지워짐`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat/history?error=chat-delete-failed", 500);
			const banner = page.locator(BANNER);
			await expect(banner).toHaveText(COPY.chatDeleteFailed);
			const bannerBox = await readBox(banner);
			const titleBox = await readBox(
				page.getByRole("heading", { level: 1, name: "대화 목록" }),
			);
			const firstItem = await readBox(page.locator("ul li").first());
			expect(bannerBox.y).toBeGreaterThan(titleBox.y);
			expect(bannerBox.y + bannerBox.height).toBeLessThan(firstItem.y);
			expect(bannerBox.x).toBe(16);
			expect(new URL(page.url()).search).toBe("");
		});

		test(`${caseId("E5", e5Number++)} 대화 목록 화면은 다른 화면의 코드를 무시함`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat/history?error=logout-failed", 300);
			await expect(page.locator(BANNER)).toHaveCount(0);
		});
	});

	test.describe("데스크톱 레일", () => {
		test.use({ viewport: DESKTOP, colorScheme: "light" });

		for (const path of ["/chat", "/chat/1"]) {
			test(`${caseId("E5", e5Number++)} ${path}?error=chat-delete-failed이면 레일 맨 위에 띠가 나오고 주소에서 error 쿼리가 지워짐`, async ({
				page,
			}) => {
				await gotoAndSettle(page, `${path}?error=chat-delete-failed`, 500);
				const rail = page.locator('[data-area="chat-rail"]');
				const banner = rail.getByRole("alert");
				await expect(banner).toHaveText(COPY.chatDeleteFailed);
				const bannerBox = await readBox(banner);
				const railBox = await readBox(rail);
				const titleBox = await readBox(rail.getByRole("heading", { level: 1 }));
				expect(bannerBox.y - railBox.y).toBe(16);
				expect(bannerBox.y + bannerBox.height).toBeLessThan(titleBox.y);
				expect(new URL(page.url()).search).toBe("");
			});
		}
	});
});
