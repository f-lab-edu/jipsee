// S3 집사 UI TC
// 기대값: 설계 문서(2026-11-13-s3-chat-design.md) 10절과 11절 사용자 결정, 캔버스 S3 보드
// 로그인 TC는 sessionMock이 { provider: "KAKAO" }일 때만 의미가 있어 TC_SESSION=in일 때만 돌림. 로그아웃 TC는 TC_SESSION=in이면 건너뜀
// 시나리오 TC는 chatMock.ts의 chatMockScenario와 같은 값을 TC_CHAT(dailyLimit, noHistory)으로 알려 줘야 함. 오류 TC는 요청을 가로채 오류 응답을 주므로 normal에서 돎
// 확인 창 폭은 S5 탈퇴 확인 창과 같은 Seed 기본값 480임(설계 문서는 400으로 적었으나 S5 TC가 480으로 정함)
import { expect, type Page } from "@playwright/test";
import { parseShadow } from "./support/bottomNav/parseShadow";
import { readHeaderEdge } from "./support/bottomNav/readHeaderEdge";
import { sameColor } from "./support/buildingDetail/sameColor";
import { TOKENS } from "./support/buildingDetail/tokens";
import { caseId } from "./support/caseId";
import { CHAT_SCENARIO, LOGGED_IN } from "./support/chat/chatScenario";
import { CHAT_COLORS, CHAT_TEXT } from "./support/chat/chatTexts";
import { readChatBubble } from "./support/chat/readChatBubble";
import { sendQuestion } from "./support/chat/sendQuestion";
import { isDimmedAt } from "./support/dialog/isDimmedAt";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { readBox } from "./support/policy/readBox";
import { SEARCH_PATH } from "./support/searchFixtures";
import { test } from "./support/test";
import { BOTTOM_NAV_HEIGHT, DESKTOP, MOBILE } from "./support/viewports";

const TABLET = { width: 768, height: 1024 };
const THEMES = ["light", "dark"] as const;
const MESSAGES_API = "**/api/chats/messages";
const ASSISTANT = '[data-area="chat-message-assistant"]';
const USER = '[data-area="chat-message-user"]';
const USER_TEXT = `${USER} p`;
const ERROR = '[data-area="chat-error"][role="alert"]';
const COMPOSER = '[data-area="chat-composer"]';
const FOOTER_MOBILE = '[data-area="footer-mobile"]';
const NAV = '[data-area="bottom-nav"]';
const NORMAL = CHAT_SCENARIO === "normal";

/** 스트림이 끝나 답변 말풍선에서 aria-busy가 빠질 때까지 기다림 */
async function waitForAnswer(page: Page, count = 1) {
	await expect(page.locator(ASSISTANT)).toHaveCount(count);
	await expect(page.locator(ASSISTANT).last()).not.toHaveAttribute(
		"aria-busy",
		"true",
	);
	await expect(page.getByRole("button", { name: "보내기" })).toBeEnabled();
}

// 커밋 1: 접근 제어, 라우트, 내비게이션 (C1)
test.describe("로그아웃 접근 제어", () => {
	test.skip(LOGGED_IN, "로그아웃 TC는 TC_SESSION이 없을 때만 돌림");
	test.use({ viewport: MOBILE });

	const cases = [
		{ number: 1, path: "/chat", next: "%2Fchat" },
		{
			number: 2,
			path: "/chat?buildingId=3",
			next: "%2Fchat%3FbuildingId%3D3",
		},
		{ number: 3, path: "/chat/history", next: "%2Fchat%2Fhistory" },
		{ number: 4, path: "/chat/1", next: "%2Fchat%2F1" },
	];

	for (const { number, path, next } of cases) {
		test(`${caseId("C1", number)} ${path}는 /login?next=${next}로 이동함`, async ({
			page,
		}) => {
			await gotoAndSettle(page, path);
			const url = new URL(page.url());
			expect(`${url.pathname}${url.search}`).toBe(`/login?next=${next}`);
		});
	}
});

test.describe("라우트와 하단 내비게이션", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C1", 5)} /chat은 200이고 h1 이름이 집사, 문서 제목이 집사 | 집씨임`, async ({
		page,
	}) => {
		expect(await gotoAndSettle(page, "/chat")).toBe(200);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			CHAT_TEXT.title,
		);
		await expect(page).toHaveTitle("집사 | 집씨");
	});

	test(`${caseId("C1", 6)} /chat/history는 h1 이름이 대화 목록, 문서 제목이 대화 목록 | 집씨임`, async ({
		page,
	}) => {
		expect(await gotoAndSettle(page, "/chat/history")).toBe(200);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			CHAT_TEXT.historyTitle,
		);
		await expect(page).toHaveTitle("대화 목록 | 집씨");
	});

	test(`${caseId("C1", 7)} /chat/1은 문서 제목이 집사 | 집씨이고 /chat/99999, /chat/abc, 건물 쿼리 오류는 404임`, async ({
		page,
	}) => {
		expect(await gotoAndSettle(page, "/chat/1")).toBe(200);
		await expect(page).toHaveTitle("집사 | 집씨");
		expect(await gotoAndSettle(page, "/chat/99999", 300)).toBe(404);
		expect(await gotoAndSettle(page, "/chat/abc", 300)).toBe(404);
		expect(await gotoAndSettle(page, "/chat?buildingId=99999", 300)).toBe(404);
		expect(await gotoAndSettle(page, "/chat?buildingId=abc", 300)).toBe(404);
	});

	test(`${caseId("C1", 8)} 홈과 검색 결과의 지난 대화 링크가 /chat/history임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		await expect(page.getByRole("link", { name: "지난 대화" })).toHaveAttribute(
			"href",
			"/chat/history",
		);
		await gotoAndSettle(page, SEARCH_PATH);
		await expect(page.getByRole("link", { name: "지난 대화" })).toHaveAttribute(
			"href",
			"/chat/history",
		);
		await page.setViewportSize(DESKTOP);
		await gotoAndSettle(page, "/");
		await expect(page.getByRole("link", { name: "지난 대화" })).toHaveAttribute(
			"href",
			"/chat/history",
		);
	});

	for (const [index, viewport] of [MOBILE, TABLET].entries()) {
		test(`${caseId("C1", 9 + index)} ${viewport.width}에서 집사 탭은 /chat에서 page, /chat/history와 /chat/1에서 true이고 href가 /chat임`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			const tab = page.locator('[data-area="bottom-nav-chat"]');
			await gotoAndSettle(page, "/chat");
			await expect(tab).toHaveAttribute("aria-current", "page");
			await expect(tab).toHaveAttribute("href", "/chat");
			for (const path of ["/chat/history", "/chat/1"]) {
				await gotoAndSettle(page, path);
				await expect(tab).toHaveAttribute("aria-current", "true");
				await expect(tab).toHaveAttribute("href", "/chat");
			}
		});
	}
});

// 커밋 2: 빈 대화, 예시 질문, 건물 기준 새 대화 (C2)
for (const theme of THEMES) {
	test.describe(`빈 대화 ${theme}`, () => {
		test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C2", 1)} ${theme} /chat의 빈 대화에 제목과 예시 질문 버튼 세 개가 있고 건물 칩이 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat");
			const empty = page.locator('[data-area="chat-empty"]');
			await expect(empty.getByRole("heading", { level: 2 })).toHaveText(
				CHAT_TEXT.emptyTitle,
			);
			const examples = page.locator(
				'[data-area="chat-example-questions"] button',
			);
			await expect(examples).toHaveText([...CHAT_TEXT.examples]);
			await expect(
				page.locator('[data-area="chat-building-chip"]'),
			).toHaveCount(0);
		});

		test(`${caseId("C2", 2)} ${theme} 예시 질문을 누르면 입력에 채워지고 전송되지 않음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat");
			await page
				.getByRole("button", { name: CHAT_TEXT.examples[1], exact: true })
				.click();
			await expect(page.getByLabel("집사에게 질문")).toHaveValue(
				CHAT_TEXT.examples[1],
			);
			await page.waitForTimeout(800);
			await expect(page.locator(USER)).toHaveCount(0);
		});

		test(`${caseId("C2", 3)} ${theme} /chat?buildingId=1은 ○○빌라 기준 칩과 건물 기준 예시 질문 두 개를 보이고 칩은 링크나 버튼이 아님`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat?buildingId=1");
			const chip = page.locator('[data-area="chat-building-chip"]');
			await expect(chip).toHaveText("○○빌라 기준");
			await expect(chip.locator("a, button")).toHaveCount(0);
			expect(await chip.evaluate((element) => element.tagName)).toBe("P");
			await expect(
				page.locator('[data-area="chat-example-questions"] button'),
			).toHaveText([...CHAT_TEXT.buildingExamples]);
		});

		test(`${caseId("C2", 4)} ${theme} 건물 기준 대화에서 새 대화를 누르면 /chat으로 가고 칩이 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat?buildingId=1");
			await page.getByRole("link", { name: "새 대화" }).click();
			await page.waitForURL(/\/chat$/);
			await expect(
				page.locator('[data-area="chat-building-chip"]'),
			).toHaveCount(0);
			await expect(
				page.locator('[data-area="chat-example-questions"] button'),
			).toHaveText([...CHAT_TEXT.examples]);
		});

		test(`${caseId("C2", 5)} ${theme} /chat/4는 ○○빌라 기준 칩이 보이고 /chat/1은 칩이 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat/4");
			await expect(page.locator('[data-area="chat-building-chip"]')).toHaveText(
				"○○빌라 기준",
			);
			await gotoAndSettle(page, "/chat/1");
			await expect(
				page.locator('[data-area="chat-building-chip"]'),
			).toHaveCount(0);
		});
	});
}

// 커밋 3: 질문 전송과 스트리밍 (C3)
test.describe("질문 전송과 스트리밍", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C3", 1)} 질문을 입력하고 Enter를 누르면 사용자 말풍선에 질문이 보이고 입력이 비워짐`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.question);
		await expect(page.getByLabel("집사에게 질문")).toHaveValue("");
	});

	test(`${caseId("C3", 2)} 전송 직후 답변 말풍선에 aria-busy가 true이고 보내기 버튼만 비활성화됨`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(ASSISTANT)).toHaveAttribute("aria-busy", "true");
		await expect(page.getByRole("button", { name: "보내기" })).toBeDisabled();
		await expect(page.getByLabel("집사에게 질문")).toBeEnabled();
		await expect(page.getByRole("status")).toHaveText("답변을 작성하는 중");
	});

	test(`${caseId("C3", 3)} 스트림이 끝나면 aria-busy가 빠지고 보내기가 켜지며 출처와 기준일이 보임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await waitForAnswer(page);
		await expect(page.locator(ASSISTANT)).not.toHaveAttribute("aria-busy");
		const sources = page.locator('[data-area="chat-sources"] p');
		await expect(sources).toHaveText([
			CHAT_TEXT.dealSource,
			CHAT_TEXT.dealBase,
		]);
	});

	test(`${caseId("C3", 4)} 답변의 건물 링크 ○○빌라 상세가 /buildings/1로 가고 높이가 44 이상임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await waitForAnswer(page);
		const link = page.getByRole("link", { name: "○○빌라 상세" });
		await expect(link).toHaveAttribute("href", "/buildings/1");
		expect((await readBox(link)).height).toBeGreaterThanOrEqual(44);
	});

	test(`${caseId("C3", 5)} 공백만 입력하고 제출하면 말풍선이 생기지 않음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, "   ");
		await page.waitForTimeout(800);
		await expect(page.locator(USER)).toHaveCount(0);
	});

	test(`${caseId("C3", 6)} 첫 질문의 답이 끝나면 주소가 /chat/{id}로 바뀌고 새로고침해도 대화가 남음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await page.waitForURL(/\/chat\/\d+$/);
		await waitForAnswer(page);
		await page.reload();
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.question);
		await expect(page.locator(ASSISTANT)).toHaveCount(1);
	});

	test(`${caseId("C3", 7)} 메시지 목록은 role log, aria-live polite이고 이름이 대화 내용임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/1");
		const log = page.getByRole("log", { name: "대화 내용" });
		await expect(log).toHaveAttribute("aria-live", "polite");
		await expect(log).toHaveAttribute("aria-relevant", "additions text");
		await expect(log).toHaveAttribute("data-area", "chat-thread");
	});

	test(`${caseId("C3", 8)} 홈 질문 폼에서 보낸 질문이 /chat에 도착하자마자 첫 말풍선이고 스트리밍이 시작됨`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		const input = page.getByRole("textbox", { name: "집사에게 질문" });
		await input.fill(CHAT_TEXT.question);
		await input.press("Enter");
		await page.waitForURL(/\/chat$/);
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.question);
		await waitForAnswer(page);
		await expect(page.locator(USER)).toHaveCount(1);
	});

	test(`${caseId("C3", 9)} /chat/1은 말풍선 네 개이고 둘째 답변 출처가 법령 줄과 법제처 기준일임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/1");
		await expect(page.locator(USER)).toHaveCount(2);
		await expect(page.locator(ASSISTANT)).toHaveCount(2);
		const order = await page
			.locator(`${USER}, ${ASSISTANT}`)
			.evaluateAll((elements) =>
				elements.map((element) => element.getAttribute("data-area")),
			);
		expect(order).toEqual([
			"chat-message-user",
			"chat-message-assistant",
			"chat-message-user",
			"chat-message-assistant",
		]);
		await expect(
			page.locator(ASSISTANT).nth(1).locator('[data-area="chat-sources"] p'),
		).toHaveText([CHAT_TEXT.lawSource, CHAT_TEXT.lawBase]);
	});

	test(`${caseId("C3", 10)} 받은 글자 뒤에 깜빡이는 커서가 있고 끝나면 사라짐`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(`${ASSISTANT} .chat-caret`)).toHaveCount(1);
		await waitForAnswer(page);
		await expect(page.locator(".chat-caret")).toHaveCount(0);
	});
});

// 커밋 3: 판단 요청과 개별 사건 안내 (C4)
test.describe("고정 안내 답변", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C4", 1)} 판단 요청을 보내면 안내 두 줄이 보이고 출처 묶음이 없음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.judgment);
		await waitForAnswer(page);
		await expect(page.locator(`${ASSISTANT} p`)).toHaveText([
			...CHAT_TEXT.judgmentLines,
		]);
		await expect(page.locator('[data-area="chat-sources"]')).toHaveCount(0);
	});

	test(`${caseId("C4", 2)} 개별 사건 질문을 보내면 안내 두 줄과 관련 조문 출처가 보임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.lawsuit);
		await waitForAnswer(page);
		for (const line of CHAT_TEXT.lawsuitLines) {
			await expect(page.locator(ASSISTANT)).toContainText(line);
		}
		await expect(page.locator('[data-area="chat-sources"] p')).toHaveText([
			CHAT_TEXT.lawsuitSource,
		]);
	});
});

// 커밋 4: 일일 한도, 오류와 다시 시도 (C5, C6)
test.describe("일일 한도 시나리오", () => {
	test.skip(
		!LOGGED_IN || CHAT_SCENARIO !== "dailyLimit",
		"TC_SESSION=in이고 chatMockScenario와 TC_CHAT이 dailyLimit일 때만 돌림",
	);

	for (const [index, viewport] of [MOBILE, DESKTOP].entries()) {
		test.describe(`${viewport.width}x${viewport.height}`, () => {
			test.use({ viewport });

			test(`${caseId("C5", 1 + index * 2)} ${viewport.width} /chat은 질문 입력 대신 질문 한도 안내가 있고 문구 두 줄이 보임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat");
				await expect(page.locator(COMPOSER)).toHaveCount(0);
				const notice = page.getByRole("status", { name: "질문 한도" });
				await expect(notice).toHaveAttribute("data-area", "chat-limit-notice");
				await expect(notice.locator("p, span")).toContainText([
					CHAT_TEXT.limitTitle,
					CHAT_TEXT.limitDescription,
				]);
			});

			test(`${caseId("C5", 2 + index * 2)} ${viewport.width} 입력 칸과 보내기 버튼이 없고 안내 상자가 하단 바 자리에 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat");
				await expect(page.getByLabel("집사에게 질문")).toHaveCount(0);
				await expect(page.getByRole("button", { name: "보내기" })).toHaveCount(
					0,
				);
				const notice = await readBox(
					page.locator('[data-area="chat-limit-notice"]'),
				);
				if (viewport === MOBILE) {
					const footer = await readBox(page.locator(FOOTER_MOBILE));
					expect(notice.y + notice.height).toBeCloseTo(footer.y, 0);
					return;
				}
				const card = await readBox(page.locator('[data-area="chat-card"]'));
				expect(notice.y + notice.height).toBeCloseTo(
					card.y + card.height - 1,
					0,
				);
			});
		});
	}

	// 시안은 데스크톱 한도 안내 바만 bg.layerFloating을 씀. 질문 입력 바는 bg.layerDefault임
	test.describe("1440x900 다크", () => {
		test.use({ viewport: DESKTOP, colorScheme: "dark" });

		test(`${caseId("C5", 6)} 1440 다크 한도 안내 바 배경이 bg.layerFloating임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat");
			const background = await page
				.locator('[data-area="chat-limit-notice"]')
				.evaluate((element) => getComputedStyle(element).backgroundColor);
			expect(background).toBe(CHAT_COLORS.dark.layerFloating);
		});
	});
});

test.describe("일일 한도 응답과 오류 응답", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C5", 5)} 전송 중 429(CHAT_DAILY_LIMIT)가 오면 질문 말풍선이 지워지고 입력이 한도 안내로 바뀜`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) =>
			route.fulfill({
				status: 429,
				contentType: "application/json",
				body: JSON.stringify({ code: "CHAT_DAILY_LIMIT" }),
			}),
		);
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.getByRole("status", { name: "질문 한도" })).toBeVisible();
		await expect(page.locator(USER)).toHaveCount(0);
		await expect(page.getByLabel("집사에게 질문")).toHaveCount(0);
	});

	test(`${caseId("C6", 1)} 서버 오류이면 오류 상자에 일시적인 오류 문구가 있고 질문 말풍선은 남으며 다시 시도 버튼 높이가 44 이상임`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) => route.fulfill({ status: 500 }));
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		const error = page.locator(ERROR);
		await expect(error).toContainText(CHAT_TEXT.serverError);
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.question);
		const retry = error.getByRole("button", { name: "다시 시도" });
		expect((await readBox(retry)).height).toBeGreaterThanOrEqual(44);
	});

	test(`${caseId("C6", 2)} 요청 제한 429이면 오류 상자에 요청이 많아요 문구가 있음`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) =>
			route.fulfill({
				status: 429,
				contentType: "application/json",
				body: JSON.stringify({ code: "TOO_MANY_REQUESTS" }),
			}),
		);
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(ERROR)).toContainText(CHAT_TEXT.rateLimit);
	});

	test(`${caseId("C6", 3)} 오류 뒤 다시 시도를 누르면 오류 상자가 사라지고 같은 질문으로 새 답변이 스트리밍됨`, async ({
		page,
	}) => {
		let calls = 0;
		await page.route(MESSAGES_API, (route) => {
			calls += 1;
			if (calls === 1) {
				return route.fulfill({ status: 500 });
			}
			return route.continue();
		});
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		const error = page.locator(ERROR);
		await expect(error).toBeVisible();
		await error.getByRole("button", { name: "다시 시도" }).click();
		await expect(error).toHaveCount(0);
		await expect(page.locator(USER)).toHaveCount(1);
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.question);
		await expect(page.locator(ASSISTANT)).toHaveAttribute("aria-busy", "true");
		await waitForAnswer(page);
		expect(calls).toBe(2);
	});

	test(`${caseId("C6", 4)} 오류 직후에도 입력과 보내기 버튼이 활성화되어 있음`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) => route.fulfill({ status: 500 }));
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(ERROR)).toBeVisible();
		await expect(page.getByLabel("집사에게 질문")).toBeEnabled();
		await expect(page.getByRole("button", { name: "보내기" })).toBeEnabled();
	});

	test(`${caseId("C6", 5)} 스트림 중간에 끊겨도 받은 글자를 지우고 오류 상자를 보임`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) =>
			route.fulfill({
				status: 200,
				contentType: "text/event-stream",
				body: 'data: {"type":"delta","text":"반쯤"}\n\n',
			}),
		);
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await expect(page.locator(ERROR)).toContainText(CHAT_TEXT.serverError);
		await expect(page.locator(ASSISTANT)).toHaveCount(0);
	});

	test(`${caseId("C6", 6)} 로그인이 풀려 401이 오면 돌아올 경로를 담아 로그인으로 이동함`, async ({
		page,
	}) => {
		await page.route(MESSAGES_API, (route) => route.fulfill({ status: 401 }));
		await gotoAndSettle(page, "/chat");
		// 로그인한 상태에서는 /login이 홈으로 다시 이동하므로 이동 요청을 확인함
		const loginRequest = page.waitForRequest((request) =>
			request.url().includes("/login?next=%2Fchat"),
		);
		await sendQuestion(page, CHAT_TEXT.question);
		await loginRequest;
	});
});

// 커밋 5: 대화 목록과 삭제 (C7)
const ITEMS = '[data-area="chat-history-item"]';
const RAIL = '[data-area="chat-rail"]';

test.describe("대화 목록", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C7", 1)} 항목 다섯 개가 최근 순이고 첫 항목이 오늘 14:20, 둘째가 어제, 셋째가 10.21임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/history");
		await expect(page.locator(ITEMS)).toHaveCount(5);
		for (const [index, title] of CHAT_TEXT.historyTitles.entries()) {
			const item = page.locator(ITEMS).nth(index);
			await expect(item.locator("a")).toContainText(title);
			await expect(item.locator("a")).toContainText(
				CHAT_TEXT.historyTimes[index],
			);
		}
	});

	test(`${caseId("C7", 2)} 항목 링크의 href가 /chat/{id}이고 누르면 그 대화로 이동함`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/history");
		const hrefs = await page
			.locator(`${ITEMS} a`)
			.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
		expect(hrefs).toEqual([
			"/chat/1",
			"/chat/2",
			"/chat/3",
			"/chat/4",
			"/chat/5",
		]);
		await page.locator(`${ITEMS} a`).nth(1).click();
		await page.waitForURL(/\/chat\/2$/);
		await expect(page.locator(USER_TEXT)).toHaveText(CHAT_TEXT.examples[1]);
	});

	test(`${caseId("C7", 3)} 항목 제목이 한 줄이고 넘치면 말줄임함`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(
			page,
			"계약갱신요구권을 행사하면 보증금을 얼마나 올릴 수 있는지와 갱신 거절 사유를 알려줘",
		);
		await waitForAnswer(page);
		await gotoAndSettle(page, "/chat/history");
		const title = page.locator(ITEMS).first().locator("a > span").first();
		const style = await title.evaluate((element) => {
			const computed = getComputedStyle(element);
			return {
				textOverflow: computed.textOverflow,
				whiteSpace: computed.whiteSpace,
				overflow: computed.overflow,
				height: element.getBoundingClientRect().height,
				isClipped: element.scrollWidth > element.clientWidth,
			};
		});
		expect(style.textOverflow).toBe("ellipsis");
		expect(style.whiteSpace).toBe("nowrap");
		expect(style.overflow).toBe("hidden");
		expect(style.height).toBe(22);
		expect(style.isClipped).toBe(true);
		await expect(page.locator(ITEMS).first().locator("a")).toContainText(
			"오늘",
		);
	});

	test(`${caseId("C7", 4)} 새로 만든 대화는 목록 맨 앞에 오고 삭제 버튼 이름이 삭제: 제목임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await waitForAnswer(page);
		await gotoAndSettle(page, "/chat/history");
		await expect(page.locator(ITEMS)).toHaveCount(6);
		await expect(
			page
				.locator(ITEMS)
				.first()
				.getByRole("button", { name: `삭제: ${CHAT_TEXT.question}` }),
		).toBeVisible();
	});

	for (const viewport of [MOBILE, DESKTOP]) {
		test(`${caseId("C7", viewport === MOBILE ? 5 : 6)} ${viewport.width}에서 삭제를 누르면 확인 창이 ${viewport === MOBILE ? "바텀시트" : "가운데 대화상자"}로 열림`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			// 데스크톱은 /chat/history가 /chat으로 이동하므로 레일에서 엶
			await gotoAndSettle(
				page,
				viewport === MOBILE ? "/chat/history" : "/chat",
			);
			await page
				.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
				.click();
			const dialog = page.getByRole("dialog");
			await expect(dialog).toHaveCount(1);
			await page.waitForTimeout(700);
			await expect(dialog).toHaveAttribute("data-area", "chat-delete-dialog");
			await expect(
				dialog.getByRole("heading", { name: CHAT_TEXT.deleteTitle }),
			).toBeVisible();
			await expect(dialog).toContainText(CHAT_TEXT.deleteDescription);
			const box = await readBox(dialog);
			if (viewport === MOBILE) {
				expect(box.width).toBe(viewport.width);
				expect(box.y + box.height).toBeCloseTo(viewport.height, 0);
				return;
			}
			expect(box.width).toBe(480);
			expect(box.x + box.width / 2).toBeCloseTo(viewport.width / 2, 0);
			expect(box.y + box.height / 2).toBeCloseTo(viewport.height / 2, 0);
		});
	}

	test(`${caseId("C7", 7)} 확인 창에서 취소하면 창이 닫히고 항목 수가 그대로임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/history");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.getByRole("button", { name: "취소" }).click();
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await expect(page.locator(ITEMS)).toHaveCount(5);
	});

	test(`${caseId("C7", 8)} 확인 창에서 삭제하기를 누르면 /chat/history로 돌아오고 항목이 하나 줄고 삭제한 대화는 404임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/history");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.getByRole("button", { name: "삭제하기" }).click();
		await page.waitForURL(/\/chat\/history$/);
		await expect(page.locator(ITEMS)).toHaveCount(4);
		await expect(page.locator(ITEMS).first().locator("a")).toContainText(
			CHAT_TEXT.historyTitles[1],
		);
		expect(await gotoAndSettle(page, "/chat/1", 300)).toBe(404);
	});

	test(`${caseId("C7", 10)} 확인 창이 열린 채 1279에서 1280으로 넘으면 창이 닫히고 /chat으로 이동하며 레일에서 다시 열면 가운데 대화상자임`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1279, height: 900 });
		await gotoAndSettle(page, "/chat/history");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.setViewportSize({ width: 1280, height: 900 });
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await page.waitForURL(/\/chat$/);
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toHaveCount(1);
		await page.waitForTimeout(700);
		const box = await readBox(dialog);
		expect(box.y + box.height / 2).toBeCloseTo(450, 0);
	});

	test(`${caseId("C7", 11)} 확인 창이 열린 채 1280에서 1279로 넘으면 창이 닫히고 레일이 사라짐`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		await gotoAndSettle(page, "/chat/1");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.setViewportSize({ width: 1279, height: 900 });
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await expect(page.locator(RAIL)).toBeHidden();
	});

	for (const [index, viewport] of [MOBILE, TABLET, DESKTOP].entries()) {
		test(`${caseId("C7", 12 + index)} ${viewport.width}에서 확인 창이 열리면 딤이 헤더와 ${viewport === DESKTOP ? "양옆 하늘빛 배경" : "푸터와 하단 내비게이션"}까지 덮음`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			await gotoAndSettle(
				page,
				viewport === DESKTOP ? "/chat" : "/chat/history",
			);
			await page
				.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
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
	}
});

test.describe("빈 대화 목록 시나리오", () => {
	test.skip(
		!LOGGED_IN || CHAT_SCENARIO !== "noHistory",
		"TC_SESSION=in이고 chatMockScenario와 TC_CHAT이 noHistory일 때만 돌림",
	);
	test.use({ viewport: MOBILE });

	test(`${caseId("C7", 9)} /chat/history는 지난 대화가 없어요 안내가 보이고 항목이 없음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/history");
		await expect(page.locator('[data-area="chat-history-empty"]')).toHaveText(
			CHAT_TEXT.historyEmpty,
		);
		await expect(page.locator(ITEMS)).toHaveCount(0);
	});
});

// 커밋 6: 레이아웃과 스타일 값 (C8)
const COLUMNS = [
	{ label: "모바일", viewport: MOBILE, x: 0, width: 390 },
	{ label: "태블릿", viewport: TABLET, x: 24, width: 720 },
] as const;

for (const { label, viewport, x, width } of COLUMNS) {
	for (const theme of THEMES) {
		test.describe(`레이아웃 ${label} ${viewport.width}x${viewport.height} ${theme}`, () => {
			test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
			test.use({ viewport, colorScheme: theme });
			const colors = CHAT_COLORS[theme];
			const isMobile = viewport === MOBILE;

			test(`${caseId("C8", isMobile ? 1 : 11)} ${label} ${theme} 열 배경, 헤더, 도구줄, 입력 바, 입력, 푸터 크기가 시안과 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat/1");
				const column = await page
					.locator('[data-area="page-column"]')
					.evaluate((element) => ({
						background: getComputedStyle(element).backgroundColor,
						...element.getBoundingClientRect().toJSON(),
					}));
				expect.soft(column.background, "열 배경").toBe(colors.layerDefault);
				expect.soft(column.x, "열 x").toBeCloseTo(x, 0);
				expect.soft(column.width, "열 폭").toBeCloseTo(width, 0);
				// 헤더는 로고 줄 56에 아래 테두리 1
				const header = await readBox(
					page.locator('[data-area="header-mobile"]'),
				);
				expect.soft(header.height, "헤더 높이").toBe(57);
				const toolbar = await readBox(
					page.locator('[data-area="chat-toolbar-mobile"]'),
				);
				expect.soft(toolbar.height, "도구줄 높이").toBeGreaterThanOrEqual(60);
				const title = await page
					.getByRole("heading", { level: 1 })
					.evaluate((element) => {
						const style = getComputedStyle(element);
						return { size: style.fontSize, weight: style.fontWeight };
					});
				expect.soft(title.size, "h1 글자 크기").toBe("20px");
				expect.soft(title.weight, "h1 굵기").toBe("700");
				const bar = await readBox(page.locator(COMPOSER));
				expect.soft(bar.height, "입력 바 높이").toBe(73);
				const input = await readBox(
					page.getByLabel("집사에게 질문").locator(".."),
				);
				expect.soft(input.height, "입력 높이").toBe(48);
				const footer = await readBox(page.locator(FOOTER_MOBILE));
				expect.soft(footer.height, "푸터 높이").toBe(44);
			});

			test(`${caseId("C8", isMobile ? 2 : 12)} ${label} ${theme} 아래에서 위로 내비게이션, 푸터, 입력 바 순서로 붙어 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat/1");
				const nav = await readBox(page.locator(NAV));
				const footer = await readBox(page.locator(FOOTER_MOBILE));
				const bar = await readBox(page.locator(COMPOSER));
				expect
					.soft(nav.y + nav.height, "내비게이션 아래 끝")
					.toBeCloseTo(viewport.height, 0);
				expect
					.soft(footer.y + footer.height, "푸터 아래 끝")
					.toBeCloseTo(nav.y, 0);
				expect
					.soft(bar.y + bar.height, "입력 바 아래 끝")
					.toBeCloseTo(footer.y, 0);
			});

			test(`${caseId("C8", isMobile ? 3 : 13)} ${label} ${theme} 말풍선 배경, 글자색, 모서리가 시안과 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat/1");
				const user = await readChatBubble(page.locator(`${USER} > div`));
				const userTextColor = await page
					.locator(USER_TEXT)
					.first()
					.evaluate((element) => getComputedStyle(element).color);
				expect
					.soft(user.background, "사용자 말풍선 배경")
					.toBe(colors.userBubble);
				expect
					.soft(userTextColor, "사용자 말풍선 글자")
					.toBe(CHAT_COLORS.white);
				expect
					.soft(user.radius, "사용자 말풍선 모서리")
					.toBe("18px 18px 4px 18px");
				const assistant = await readChatBubble(
					page.locator(`${ASSISTANT} > div`),
				);
				expect
					.soft(assistant.background, "답변 말풍선 배경")
					.toBe(colors.neutralWeak);
				expect
					.soft(assistant.radius, "답변 말풍선 모서리")
					.toBe("18px 18px 18px 4px");
			});

			test(`${caseId("C8", isMobile ? 4 : 14)} ${label} ${theme} 말풍선 최대 폭이 대화 영역 안쪽 폭의 비율 이하임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat");
				await sendQuestion(
					page,
					"계약갱신요구권을 행사하면 보증금을 얼마나 올릴 수 있는지와 갱신 거절 사유를 한꺼번에 알려줘",
				);
				await waitForAnswer(page);
				const inner = width - 32;
				const userRatio = isMobile ? 0.86 : 0.72;
				const assistantRatio = isMobile ? 0.92 : 0.82;
				const userWidth = (await readBox(page.locator(USER))).width;
				const assistantWidth = (await readBox(page.locator(ASSISTANT))).width;
				expect
					.soft(userWidth, "사용자 말풍선 폭")
					.toBeLessThanOrEqual(inner * userRatio + 1);
				expect
					.soft(userWidth, "긴 질문은 최대 폭까지 참")
					.toBeGreaterThan(inner * userRatio - 40);
				expect
					.soft(assistantWidth, "답변 말풍선 폭")
					.toBeLessThanOrEqual(inner * assistantRatio + 1);
			});
		});
	}
}

test.describe("데스크톱 레이아웃", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");

	for (const theme of THEMES) {
		test(`${caseId("C8", theme === "light" ? 5 : 15)} ${theme} 1440x900에서 폭 1152 카드가 가운데에서 헤더와 푸터 사이를 채우고 모서리 20, 입력 높이 52임`, async ({
			page,
		}) => {
			await page.setViewportSize(DESKTOP);
			await page.emulateMedia({ colorScheme: theme });
			await gotoAndSettle(page, "/chat/1");
			const card = page.locator('[data-area="chat-card"]');
			const box = await readBox(card);
			expect.soft(box.width, "카드 폭").toBe(1152);
			expect.soft(box.x, "카드 x").toBe(144);
			const header = await readBox(
				page.locator('[data-area="header-desktop"]'),
			);
			const footer = await readBox(
				page.locator('[data-area="footer-desktop"]'),
			);
			// 본문 padding 24
			expect
				.soft(box.y, "카드가 헤더 아래 24")
				.toBeCloseTo(header.y + header.height + 24, 0);
			expect
				.soft(box.y + box.height, "카드가 푸터 위 24")
				.toBeCloseTo(footer.y - 24, 0);
			const logo = await readBox(page.getByRole("link", { name: "집씨 홈" }));
			expect
				.soft(box.x, "카드 왼쪽 끝이 로고 왼쪽 끝과 같음")
				.toBeCloseTo(logo.x, 0);
			const style = await card.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					radius: computed.borderTopLeftRadius,
					border: computed.borderTopWidth,
					background: computed.backgroundColor,
				};
			});
			expect.soft(style.radius, "카드 모서리").toBe("20px");
			expect.soft(style.border, "카드 테두리").toBe("1px");
			expect
				.soft(style.background, "카드 배경")
				.toBe(CHAT_COLORS[theme].layerDefault);
			const input = await readBox(
				page.getByLabel("집사에게 질문").locator(".."),
			);
			expect.soft(input.height, "입력 높이").toBe(52);
			const account = page.getByRole("link", { name: "내 정보" });
			await expect.soft(account).toBeVisible();
			await expect.soft(account).not.toHaveAttribute("aria-current");
			await expect.soft(page.locator(NAV)).toBeHidden();
		});
	}

	test(`${caseId("C8", 6)} 1279에서는 열이 흰색이고 내비게이션이 보이며 1280에서는 카드가 보이고 열이 흰색이 아님`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1279, height: 900 });
		await gotoAndSettle(page, "/chat/1");
		const column = page.locator('[data-area="page-column"]');
		await expect(column).toHaveCSS(
			"background-color",
			CHAT_COLORS.light.layerDefault,
		);
		await expect(page.locator(NAV)).toBeVisible();
		await expect(page.locator('[data-area="chat-card"]')).toHaveCSS(
			"border-top-width",
			"0px",
		);
		await page.setViewportSize({ width: 1280, height: 900 });
		await expect(column).not.toHaveCSS(
			"background-color",
			CHAT_COLORS.light.layerDefault,
		);
		await expect(page.locator(NAV)).toBeHidden();
		await expect(page.locator('[data-area="chat-card"]')).toHaveCSS(
			"border-top-width",
			"1px",
		);
	});
});

for (const { label, viewport } of COLUMNS) {
	for (const theme of THEMES) {
		test.describe(`헤더 구분선 ${label} ${theme}`, () => {
			test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
			test.use({ viewport, colorScheme: theme });

			test(`${caseId("C8", 7)} ${label} ${theme} 헤더 아래 테두리가 1px stroke.neutralMuted이고 아래로 퍼지는 그림자가 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/chat/1");
				const edge = await readHeaderEdge(page);
				expect.soft(edge.borderBottomWidth).toBe("1px");
				expect
					.soft(sameColor(edge.borderBottomColor, TOKENS[theme].strokeMuted))
					.toBe(true);
				const shadow = parseShadow(edge.boxShadow);
				expect.soft(shadow.y, "그림자 y").toBe(6);
				expect.soft(shadow.blur, "그림자 blur").toBe(20);
			});
		});
	}
}

test.describe("스크롤", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: { width: 390, height: 480 } });

	test(`${caseId("C8", 9)} /chat/1을 스크롤해도 헤더, 입력 바, 푸터, 내비게이션이 제자리에 있음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/1");
		const selectors = [
			'[data-area="header-mobile"]',
			COMPOSER,
			FOOTER_MOBILE,
			NAV,
		];
		const scrollable = await page.evaluate(
			() => document.documentElement.scrollHeight - window.innerHeight,
		);
		expect(scrollable).toBeGreaterThan(100);
		const before = await Promise.all(
			selectors.map((s) => readBox(page.locator(s))),
		);
		await page.evaluate(() => window.scrollTo(0, 120));
		await page.waitForTimeout(200);
		const after = await Promise.all(
			selectors.map((s) => readBox(page.locator(s))),
		);
		for (const [index, selector] of selectors.entries()) {
			expect
				.soft(after[index].y, `${selector} y`)
				.toBeCloseTo(before[index].y, 0);
		}
	});
});

// 데스크톱 대화 목록 레일 (C10). 설계 문서 15절과 캔버스 S3 집사 데스크톱 보드 S3DConceptA, S3DEmpty, S3DBuilding
const RAIL_NEW_CHAT = `${RAIL} [data-area="chat-toolbar-desktop"] a`;
const RAIL_ITEM_LINKS = `${RAIL} [data-area="chat-history-item"] a`;

for (const theme of THEMES) {
	test.describe(`데스크톱 레일 ${theme}`, () => {
		test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
		test.use({ viewport: DESKTOP, colorScheme: theme });
		const colors = CHAT_COLORS[theme];

		test(`${caseId("C10", theme === "light" ? 1 : 2)} ${theme} 레일 폭 296, 배경, 오른쪽 테두리, 제목, 새 대화 버튼, 소제목, 항목 크기가 시안과 같음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat/1");
			const card = await readBox(page.locator('[data-area="chat-card"]'));
			const rail = await readBox(page.locator(RAIL));
			expect.soft(rail.width, "레일 폭").toBe(296);
			expect.soft(rail.x, "레일 x").toBe(card.x + 1);
			expect
				.soft(rail.height, "레일 높이는 카드 안쪽 높이")
				.toBe(card.height - 2);
			const pane = await readBox(page.locator('[data-area="chat-pane"]'));
			expect.soft(pane.width, "대화 영역 폭").toBe(854);
			expect.soft(pane.x, "대화 영역 x").toBe(rail.x + 296);
			const railStyle = await page.locator(RAIL).evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					background: computed.backgroundColor,
					borderRightWidth: computed.borderRightWidth,
					borderRightColor: computed.borderRightColor,
				};
			});
			expect.soft(railStyle.background, "레일 배경").toBe(colors.neutralWeak);
			expect.soft(railStyle.borderRightWidth, "오른쪽 테두리").toBe("1px");
			expect
				.soft(railStyle.borderRightColor, "오른쪽 테두리 색")
				.toBe(colors.strokeMuted);
			const title = page.locator(`${RAIL} h1`);
			await expect.soft(title).toHaveText(CHAT_TEXT.title);
			const titleStyle = await title.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					size: computed.fontSize,
					line: computed.lineHeight,
					weight: computed.fontWeight,
				};
			});
			expect
				.soft(titleStyle, "h1 글자")
				.toEqual({ size: "22px", line: "30px", weight: "700" });
			const newChat = await readBox(page.locator(RAIL_NEW_CHAT));
			expect.soft(newChat.height, "새 대화 버튼 높이").toBe(44);
			expect.soft(newChat.x - rail.x, "새 대화 버튼 왼쪽 여백").toBe(16);
			expect.soft(newChat.width, "새 대화 버튼 폭").toBe(263);
			await expect
				.soft(page.locator(RAIL_NEW_CHAT))
				.toHaveCSS("border-radius", "12px");
			const heading = page.getByRole("heading", {
				name: "대화 목록",
				level: 2,
			});
			const headingStyle = await heading.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					size: computed.fontSize,
					line: computed.lineHeight,
					weight: computed.fontWeight,
				};
			});
			expect
				.soft(headingStyle, "소제목 글자")
				.toEqual({ size: "12px", line: "18px", weight: "700" });
			const items = page.locator(`${RAIL} ${ITEMS}`);
			await expect(items).toHaveCount(5);
			const boxes = await Promise.all(
				[0, 1, 2, 3, 4].map((index) => readBox(items.nth(index))),
			);
			for (const [index, box] of boxes.entries()) {
				expect
					.soft(box.height, `항목 ${index} 높이`)
					.toBeGreaterThanOrEqual(64);
				expect.soft(box.x - rail.x, `항목 ${index} 왼쪽 여백`).toBe(8);
				expect.soft(box.width, `항목 ${index} 폭`).toBe(279);
				if (index > 0) {
					expect
						.soft(
							box.y - (boxes[index - 1].y + boxes[index - 1].height),
							`항목 ${index} 간격`,
						)
						.toBe(2);
				}
			}
			await expect.soft(items.first()).toHaveCSS("border-radius", "12px");
			const trigger = page.getByRole("button", {
				name: `삭제: ${CHAT_TEXT.historyTitles[1]}`,
			});
			const triggerBox = await readBox(trigger);
			expect.soft(triggerBox.height, "삭제 버튼 높이").toBe(40);
			expect.soft(triggerBox.width, "삭제 버튼 폭").toBeGreaterThanOrEqual(52);
			await expect.soft(trigger).toHaveCSS("border-radius", "9999px");
			const itemTitle = items.nth(1).locator("a > span").first();
			const itemTime = items.nth(1).locator("a > span").nth(1);
			const itemTitleStyle = await itemTitle.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					size: computed.fontSize,
					line: computed.lineHeight,
					weight: computed.fontWeight,
					overflow: computed.textOverflow,
				};
			});
			expect.soft(itemTitleStyle, "항목 제목 글자").toEqual({
				size: "14px",
				line: "20px",
				weight: "500",
				overflow: "ellipsis",
			});
			const itemTimeStyle = await itemTime.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					size: computed.fontSize,
					line: computed.lineHeight,
					color: computed.color,
				};
			});
			expect.soft(itemTimeStyle.size, "시각 글자 크기").toBe("12px");
			expect.soft(itemTimeStyle.line, "시각 줄 높이").toBe("18px");
		});

		test(`${caseId("C10", theme === "light" ? 3 : 4)} ${theme} 지금 보는 대화 항목은 흰 바탕, 테두리, 굵은 제목, aria-current이고 새 대화 버튼은 기본 모양임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/chat/2");
			const items = page.locator(`${RAIL} ${ITEMS}`);
			const current = items.nth(1);
			await expect
				.soft(current)
				.toHaveCSS("background-color", colors.layerDefault);
			await expect
				.soft(current)
				.toHaveCSS("border-top-color", colors.strokeWeak);
			await expect.soft(current).toHaveCSS("border-top-width", "1px");
			await expect
				.soft(current.locator("a"))
				.toHaveAttribute("aria-current", "page");
			await expect
				.soft(current.locator("a > span").first())
				.toHaveCSS("font-weight", "700");
			for (const index of [0, 2, 3, 4]) {
				const other = items.nth(index);
				await expect
					.soft(other, `항목 ${index} 배경`)
					.toHaveCSS("background-color", CHAT_COLORS.transparent);
				await expect
					.soft(other, `항목 ${index} 테두리`)
					.toHaveCSS("border-top-color", CHAT_COLORS.transparent);
				await expect
					.soft(other.locator("a"), `항목 ${index} aria-current`)
					.not.toHaveAttribute("aria-current");
				await expect
					.soft(other.locator("a > span").first(), `항목 ${index} 제목 굵기`)
					.toHaveCSS("font-weight", "500");
			}
			const newChat = page.locator(RAIL_NEW_CHAT);
			await expect.soft(newChat).not.toHaveAttribute("aria-current");
			await expect
				.soft(newChat)
				.toHaveCSS("background-color", colors.layerDefault);
			await expect
				.soft(newChat)
				.toHaveCSS("border-top-color", colors.strokeWeak);
		});

		for (const [index, path] of ["/chat", "/chat?buildingId=1"].entries()) {
			test(`${caseId("C10", 5 + index + (theme === "light" ? 0 : 2))} ${theme} ${path}에서는 항목이 선택되지 않고 새 대화 버튼이 파란 테두리, brandWeak 채움, aria-current임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, path);
				const newChat = page.locator(RAIL_NEW_CHAT);
				await expect.soft(newChat).toHaveAttribute("aria-current", "page");
				await expect
					.soft(newChat)
					.toHaveCSS("background-color", colors.brandWeak);
				await expect
					.soft(newChat)
					.toHaveCSS("border-top-color", colors.brandStroke);
				await expect.soft(newChat).toHaveCSS("border-top-width", "1px");
				await expect
					.soft(newChat.locator("span"))
					.toHaveCSS("color", colors.brandFg);
				await expect
					.soft(page.locator(`${RAIL_ITEM_LINKS}[aria-current]`))
					.toHaveCount(0);
				await expect.soft(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(5);
			});
		}
	});
}

test.describe("데스크톱 레일 동작", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: DESKTOP });

	test(`${caseId("C10", 9)} 대화 본문, 입력, 건물 칩, 예시 질문이 폭 720 열로 가운데에 있음`, async ({
		page,
	}) => {
		const pane = { x: 441, width: 854 };
		const columnX = pane.x + (pane.width - 720) / 2;
		await gotoAndSettle(page, "/chat/1");
		const form = await readBox(
			page.getByLabel("집사에게 질문").locator("../.."),
		);
		expect.soft(form.x, "입력 열 x").toBe(columnX);
		expect.soft(form.width, "입력 열 폭").toBe(720);
		const composer = await readBox(page.locator(COMPOSER));
		// 위 테두리 1, 위 16, 입력 52, 아래 20
		expect.soft(composer.height, "입력 바 높이").toBe(89);
		const user = await readBox(page.locator(USER).first());
		expect
			.soft(user.x + user.width, "사용자 말풍선 오른쪽 끝")
			.toBe(columnX + 720);
		const assistant = await readBox(page.locator(ASSISTANT).first());
		expect.soft(assistant.x, "답변 말풍선 왼쪽 끝").toBe(columnX);
		expect
			.soft(assistant.width, "답변 말풍선 최대 폭")
			.toBeLessThanOrEqual(720 * 0.82 + 1);
		await gotoAndSettle(page, "/chat?buildingId=1");
		const chip = await readBox(
			page.locator('[data-area="chat-building-chip"]'),
		);
		expect.soft(chip.x, "건물 칩 x").toBe(columnX);
		expect.soft(chip.height, "건물 칩 높이").toBe(32);
		const examples = await readBox(
			page.locator('[data-area="chat-example-questions"]'),
		);
		expect.soft(examples.width, "예시 질문 폭").toBe(480);
	});

	test(`${caseId("C10", 10)} 데스크톱에서 /chat/history를 열면 /chat으로 이동하고 레일이 보임`, async ({
		page,
	}) => {
		await page.goto("/chat/history");
		await page.waitForURL(/\/chat$/);
		await expect(page.locator(RAIL)).toBeVisible();
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(5);
	});

	test(`${caseId("C10", 11)} 모바일과 태블릿에서는 레일이 없고 /chat/history가 그대로 열림`, async ({
		page,
	}) => {
		for (const viewport of [MOBILE, TABLET]) {
			await page.setViewportSize(viewport);
			await gotoAndSettle(page, "/chat/1");
			await expect(page.locator(RAIL)).toBeHidden();
			await gotoAndSettle(page, "/chat/history");
			expect(new URL(page.url()).pathname).toBe("/chat/history");
			await expect(page.locator(ITEMS)).toHaveCount(5);
		}
	});

	test(`${caseId("C10", 12)} 새 대화는 스트리밍 중에는 레일에 없고 답변이 끝나 /chat/{id}로 바뀐 뒤 맨 위에 나타나 선택됨`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.examples[2]);
		await expect(page.locator(ASSISTANT)).toHaveAttribute("aria-busy", "true");
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(5);
		await expect(page.locator(RAIL_NEW_CHAT)).toHaveAttribute(
			"aria-current",
			"page",
		);
		await waitForAnswer(page);
		await page.waitForURL(/\/chat\/6$/);
		const items = page.locator(`${RAIL} ${ITEMS}`);
		await expect(items).toHaveCount(6);
		await expect(items.first().locator("a")).toContainText(
			CHAT_TEXT.examples[2],
		);
		await expect(items.first().locator("a")).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(page.locator(RAIL_NEW_CHAT)).not.toHaveAttribute(
			"aria-current",
		);
	});

	test(`${caseId("C10", 13)} 지난 대화에 질문하고 답변이 끝나면 그 대화가 레일 맨 위로 올라옴`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/3");
		const items = page.locator(`${RAIL} ${ITEMS}`);
		await expect(items.nth(2).locator("a")).toHaveAttribute("href", "/chat/3");
		await sendQuestion(page, CHAT_TEXT.question);
		await waitForAnswer(page, 2);
		await expect(items.first().locator("a")).toHaveAttribute("href", "/chat/3");
		await expect(items.first().locator("a")).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(items).toHaveCount(5);
	});

	test(`${caseId("C10", 14)} 레일 항목의 삭제를 누르고 삭제하기를 누르면 /chat으로 이동하고 항목이 하나 줄고 삭제한 대화는 404임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/1");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toHaveCount(1);
		await page.waitForTimeout(700);
		expect((await readBox(dialog)).width).toBe(480);
		await page.getByRole("button", { name: "삭제하기" }).click();
		await page.waitForURL(/\/chat$/);
		const items = page.locator(`${RAIL} ${ITEMS}`);
		await expect(items).toHaveCount(4);
		await expect(items.first().locator("a")).toContainText(
			CHAT_TEXT.historyTitles[1],
		);
		await expect(page.locator(RAIL_NEW_CHAT)).toHaveAttribute(
			"aria-current",
			"page",
		);
		expect(await gotoAndSettle(page, "/chat/1", 300)).toBe(404);
	});

	test(`${caseId("C10", 19)} 열려 있지 않은 대화를 레일에서 삭제하면 주소와 열린 대화가 그대로이고 항목만 하나 줄어듦`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/2");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.getByRole("button", { name: "삭제하기" }).click();
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(4);
		expect(new URL(page.url()).pathname).toBe("/chat/2");
		await expect(
			page.locator(`${RAIL} ${ITEMS} a[href="/chat/1"]`),
		).toHaveCount(0);
		await expect(
			page.locator(`${RAIL} ${ITEMS} a[aria-current="page"]`),
		).toHaveAttribute("href", "/chat/2");
		expect(await gotoAndSettle(page, "/chat/1", 300)).toBe(404);
	});

	test(`${caseId("C10", 20)} 새 대화 화면에서 레일의 대화를 삭제하면 /chat에 머물고 항목이 하나 줄어듦`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[0]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.getByRole("button", { name: "삭제하기" }).click();
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(4);
		expect(new URL(page.url()).pathname).toBe("/chat");
		await expect(page.locator(RAIL_NEW_CHAT)).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test(`${caseId("C10", 15)} 레일 확인 창에서 취소하면 창이 닫히고 항목 수와 주소가 그대로임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/2");
		await page
			.getByRole("button", { name: `삭제: ${CHAT_TEXT.historyTitles[3]}` })
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.waitForTimeout(700);
		await page.getByRole("button", { name: "취소" }).click();
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(5);
		expect(new URL(page.url()).pathname).toBe("/chat/2");
	});

	test(`${caseId("C10", 16)} 목록이 길어도 레일 높이는 카드 높이에 묶이고 목록만 레일 안에서 스크롤됨`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 500 });
		await gotoAndSettle(page, "/chat");
		const card = await readBox(page.locator('[data-area="chat-card"]'));
		const rail = await readBox(page.locator(RAIL));
		expect(rail.height).toBe(card.height - 2);
		const nav = page.locator('[data-area="chat-history"]');
		const scroll = await nav.evaluate((element) => ({
			client: element.clientHeight,
			scroll: element.scrollHeight,
			overflowY: getComputedStyle(element).overflowY,
		}));
		expect(scroll.overflowY).toBe("auto");
		expect(scroll.scroll).toBeGreaterThan(scroll.client);
	});
});

test.describe("데스크톱 빈 목록 시나리오", () => {
	test.skip(
		!LOGGED_IN || CHAT_SCENARIO !== "noHistory",
		"TC_SESSION=in이고 chatMockScenario와 TC_CHAT이 noHistory일 때만 돌림",
	);
	test.use({ viewport: DESKTOP });

	test(`${caseId("C10", 17)} /chat 레일에 지난 대화가 없어요 안내가 보이고 항목이 없음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await expect(
			page.locator(`${RAIL} [data-area="chat-history-empty"]`),
		).toHaveText(CHAT_TEXT.historyEmpty);
		await expect(page.locator(ITEMS)).toHaveCount(0);
		await expect(page.locator(RAIL_NEW_CHAT)).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
});

test.describe("데스크톱 한도 시나리오", () => {
	test.skip(
		!LOGGED_IN || CHAT_SCENARIO !== "dailyLimit",
		"TC_SESSION=in이고 chatMockScenario와 TC_CHAT이 dailyLimit일 때만 돌림",
	);
	test.use({ viewport: DESKTOP });

	test(`${caseId("C10", 18)} 한도 안내 상자가 폭 720 열에 맞고 바 패딩이 16 24 20이며 레일은 그대로 보임`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat/1");
		const notice = page.locator('[data-area="chat-limit-notice"]');
		const bar = await readBox(notice);
		const inner = await readBox(notice.locator("> div"));
		expect(inner.width).toBe(720);
		expect(inner.x).toBe(441 + 67);
		expect(inner.y - bar.y).toBe(17);
		expect(bar.y + bar.height - (inner.y + inner.height)).toBe(20);
		await expect(page.locator(`${RAIL} ${ITEMS}`)).toHaveCount(5);
	});
});

// 커밋 7: 접근성과 콘솔 (C9)
test.describe("접근성", () => {
	test.skip(!LOGGED_IN || !NORMAL, "로그인 TC는 TC_SESSION=in일 때만 돌림");
	test.use({ viewport: MOBILE });

	test(`${caseId("C9", 1)} 입력에 연결된 이름 집사에게 질문, 버튼 이름 보내기, 도구줄 링크 이름 대화 목록과 새 대화가 있음`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/chat");
		await expect(page.getByLabel("집사에게 질문")).toHaveCount(1);
		await expect(page.getByRole("button", { name: "보내기" })).toHaveCount(1);
		await expect(page.getByRole("link", { name: "대화 목록" })).toHaveAttribute(
			"href",
			"/chat/history",
		);
		await expect(page.getByRole("link", { name: "새 대화" })).toHaveAttribute(
			"href",
			"/chat",
		);
	});

	for (const path of [
		"/chat",
		"/chat/1",
		"/chat?buildingId=1",
		"/chat/history",
	]) {
		test(`${caseId("C9", 2)} ${path}에 겹치는 id가 없음`, async ({ page }) => {
			await gotoAndSettle(page, path);
			const duplicates = await page.evaluate(() => {
				const ids = [...document.querySelectorAll("[id]")].map(
					(element) => element.id,
				);
				return ids.filter((id, index) => ids.indexOf(id) !== index);
			});
			expect(duplicates).toEqual([]);
		});
	}

	test(`${caseId("C9", 3)} 모든 상태를 지나는 동안 콘솔 오류가 없음`, async ({
		page,
	}) => {
		// 콘솔 오류는 fixture가 테스트 끝에서 확인함
		await gotoAndSettle(page, "/chat");
		await sendQuestion(page, CHAT_TEXT.question);
		await waitForAnswer(page);
		await gotoAndSettle(page, "/chat/history");
		await page
			.getByRole("button", { name: /^삭제: / })
			.first()
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(1);
		await page.getByRole("button", { name: "취소" }).click();
		await gotoAndSettle(page, "/chat?buildingId=1");
	});
});
