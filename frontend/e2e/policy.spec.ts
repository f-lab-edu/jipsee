// S6 정책 화면(이용약관, 개인정보처리방침, 데이터 출처) UI TC
// 기대값: 설계 문서(2026-11-12-s6-policy-design.md) 3, 5, 9절, 본문 문서(2026-11-12-s6-policy-content.md) 3절, 와이어프레임 s6-policy-wireframe.svg. 2026-11-09 피드백이 다르면 피드백을 따름
// S6 치수와 색(P6)은 캔버스 S6 보드 6장과 다크 짝(S6TermsMobile 등, 캔버스 https://claude.ai/artifact/CqbqcKedWvYUEwqB77ZKj6 "S6 정책")에서 가져옴. 보드가 설계 문서와 다르면 보드를 따름
// 본문 글자는 config 데이터와 화면의 개수와 일치만 확인함(정식 본문으로 바뀌면 config만 바꿈)
// Seed fontWeight에 600이 없어 보드의 글자 굵기 600은 700으로 확인함
// 로그인 상태 TC는 sessionMock이 { provider: "KAKAO" }일 때만 의미가 있어 TC_SESSION=in일 때만 돌림. 로그아웃 전제 TC는 TC_SESSION=in이면 건너뜀
import { expect, type Page } from "@playwright/test";
import { privacyDocument } from "../src/pages/policy/config/privacyDocument";
import { termsDocument } from "../src/pages/policy/config/termsDocument";
import { parseColor } from "./support/buildingDetail/parseColor";
import { sameColor } from "./support/buildingDetail/sameColor";
import { TOKENS } from "./support/buildingDetail/tokens";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { POLICY_TOKENS } from "./support/policy/policyTokens";
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

const TERMS = { path: "/policies/terms", title: "이용약관" };
const PRIVACY = { path: "/policies/privacy", title: "개인정보처리방침" };
const DATA_SOURCES = { path: "/policies/data-sources", title: "데이터 출처" };
const ALL_PAGES = [TERMS, PRIVACY, DATA_SOURCES];

// 와이어프레임 처리방침 목차 10개와 기획서 이용약관 항목명 7개
const PRIVACY_TOC = [
	"처리 목적",
	"처리 항목",
	"보유 기간, 파기",
	"처리 위탁",
	"국외 이전",
	"쿠키",
	"정보주체 권리",
	"안전성 확보 조치",
	"보호책임자",
	"변경",
];
const TERMS_TOC = [
	"서비스 내용",
	"회원",
	"이용 제한",
	"데이터 한계",
	"챗봇",
	"책임",
	"변경, 분쟁",
];
const DOCUMENTS = [
	{ ...TERMS, toc: TERMS_TOC, data: termsDocument },
	{ ...PRIVACY, toc: PRIVACY_TOC, data: privacyDocument },
];

const DRAFT_NOTICE =
	"이 문서는 임시로 작성한 초안입니다. 정식 문서가 게시되기 전까지 내용이 바뀔 수 있습니다.";
const DATA_SOURCES_DRAFT_NOTICE =
	"임시로 적은 안내예요. 정식 안내가 나오면 내용이 바뀔 수 있어요";

// 본문 문서 3.2절 표(1단계 카드 세 장)
const CARDS = [
	{
		name: "연립다세대 전월세 실거래",
		provider: "국토교통부, 공공데이터포털",
		update: "매일 갱신, 2026.09 기준",
		href: "https://www.data.go.kr/data/15126473/openapi.do",
	},
	{
		name: "연립다세대 매매 실거래",
		provider: "국토교통부, 공공데이터포털",
		update: "매일 갱신, 2026.09 기준",
		href: "https://www.data.go.kr/data/15126467/openapi.do",
	},
	{
		name: "건축물대장 표제부",
		provider: "국토교통부 건축HUB",
		update: "매월 갱신, 2026.09 기준",
		href: "https://www.data.go.kr/data/15134735/openapi.do",
	},
];
// 본문 문서 3.1절. 첫 줄은 S2 확정일자 안내 문장과 같음
const LIMIT_LINES = [
	"확정일자를 기준으로 수집한 거래예요. 최근 1~2개월 거래는 일부 빠져 있을 수 있어요",
	"거래가 공개되기까지 시간이 걸려 늦게 나타나는 거래도 있어요",
	"공시가격은 직접 보여 주지 않아요. 부동산공시가격 알리미에서 확인해 주세요",
];

async function expectVisibleHeading(page: Page, title: string) {
	const heading = page.locator("h1:visible");
	await expect(heading).toHaveCount(1);
	await expect(heading).toHaveText(title);
}

for (const { label, viewport, layout } of SCREENS) {
	const isMobile = layout === "mobile";

	for (const theme of THEMES) {
		test.describe(`${label} ${viewport.width}x${viewport.height} ${theme}`, () => {
			test.use({ viewport, colorScheme: theme });
			const token = TOKENS[theme];

			// P1 라우트와 메타데이터
			for (const { path, title } of ALL_PAGES) {
				test(`${caseId("P1", 1)} ${label} ${theme} ${path}는 200이고 콘솔 오류가 없음`, async ({
					page,
				}) => {
					expect(await gotoAndSettle(page, path)).toBe(200);
				});

				test(`${caseId("P1", 3)} ${label} ${theme} ${path}의 보이는 h1은 ${title} 하나임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					await expectVisibleHeading(page, title);
				});

				test(`${caseId("P1", 5)} ${label} ${theme} ${path}에 id 중복이 없음`, async ({
					page,
				}) => {
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

			if (isMobile && theme === "light") {
				for (const { path, title } of ALL_PAGES) {
					test(`${caseId("P1", 2)} 모바일 ${path}의 문서 제목이 ${title} | 집씨임`, async ({
						page,
					}) => {
						await gotoAndSettle(page, path);
						await expect(page).toHaveTitle(`${title} | 집씨`);
					});

					test(`${caseId("P1", 6)} 모바일 ${path}는 390과 320 폭에서 가로 스크롤이 없음`, async ({
						page,
					}) => {
						for (const width of [390, 320]) {
							await page.setViewportSize({ width, height: 844 });
							await gotoAndSettle(page, path);
							const scrollWidth = await page.evaluate(
								() => document.documentElement.scrollWidth,
							);
							expect(scrollWidth).toBeLessThanOrEqual(width);
						}
					});
				}

				test(`${caseId("P1", 4)} 모바일 /policies/unknown은 404임`, async ({
					page,
				}) => {
					expect(await gotoAndSettle(page, "/policies/unknown")).toBe(404);
				});
			}

			// P1-03 모바일은 본문 첫 줄 h1, 데스크톱은 열 맨 위 h1
			for (const { path, title } of ALL_PAGES) {
				test(`${caseId("P1", 3)} ${label} ${theme} ${path}의 h1이 ${isMobile ? "본문 첫 줄" : "열 맨 위"}에 있음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					const heading = page.locator("h1:visible");
					await expect(heading).toHaveText(title);
					const main = await page.locator('[data-area="main"]').boundingBox();
					const box = await heading.boundingBox();
					expect(box?.y ?? 0).toBeGreaterThanOrEqual(main?.y ?? 0);
					// 제목 위에는 위 여백 20(모바일) 또는 40(데스크톱)만 있음
					expect((box?.y ?? 0) - (main?.y ?? 0)).toBeLessThanOrEqual(
						isMobile ? 24 : 48,
					);
				});
			}

			// P2 링크 연결
			test(`${caseId("P2", 1)} ${label} ${theme} 푸터 링크가 세 경로로 이동하고 h1이 맞음`, async ({
				page,
			}) => {
				for (const { path, title } of ALL_PAGES) {
					await gotoAndSettle(page, "/");
					await page
						.getByTestId(`footer-${layout}`)
						.getByRole("link", { name: title, exact: true })
						.click();
					await expect(page).toHaveURL(path);
					await expectVisibleHeading(page, title);
				}
			});

			// P3 문서 화면
			for (const { path, title, toc, data } of DOCUMENTS) {
				const body = (page: Page) => page.getByTestId(`policy-body-${layout}`);
				const tocNav = (page: Page) =>
					body(page).getByRole("navigation", { name: "목차" });

				test(`${caseId("P3", 1)} ${label} ${theme} ${title} 시행일 줄이 시행일 2026.11.12이고 이전 버전 링크가 없음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					await expect(
						page.locator(`[data-area="policy-effective-date-${layout}"]`),
					).toHaveText("시행일 2026.11.12");
					await expect(
						page.getByRole("link", { name: /이전 버전/ }),
					).toHaveCount(0);
				});

				test(`${caseId("P3", toc.length === 10 ? 2 : 3)} ${label} ${theme} ${title} 목차가 nav 안 ol이고 항목 ${toc.length}개의 순서와 문구가 맞음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					const items = tocNav(page).locator("ol > li");
					await expect(items).toHaveCount(toc.length);
					await expect(items).toHaveText(
						toc.map((name, index) => `${index + 1}.${name}`),
					);
				});

				test(`${caseId("P3", 4)} ${label} ${theme} ${title} 목차 항목과 조항 h2가 개수와 문구가 같음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					const headings = body(page).locator("h2");
					await expect(headings).toHaveCount(toc.length);
					await expect(headings).toHaveText(
						toc.map((name, index) => `${index + 1}. ${name}`),
					);
				});

				test(`${caseId("P3", 5)} ${label} ${theme} ${title} 목차 항목을 누르면 해시가 조항 id가 되고 제목이 고정 헤더에 가리지 않음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					for (const order of [3, toc.length]) {
						await tocNav(page)
							.getByRole("link", { name: toc[order - 1], exact: true })
							.click();
						await expect(page).toHaveURL(
							new RegExp(`#clause-${order}-${layout}$`),
						);
						await page.waitForTimeout(300);
						const heading = await page
							.locator(`#clause-${order}-${layout}-title`)
							.boundingBox();
						const header = await page.locator("header").boundingBox();
						expect(heading?.y ?? 0).toBeGreaterThanOrEqual(
							(header?.y ?? 0) + (header?.height ?? 0),
						);
						expect(
							(heading?.y ?? 0) + (heading?.height ?? 0),
						).toBeLessThanOrEqual(viewport.height);
					}
				});

				test(`${caseId("P3", 8)} ${label} ${theme} ${title} 로그인하지 않아도 열리고 로그인 화면으로 보내지 않음`, async ({
					page,
				}) => {
					test.skip(LOGGED_IN, "로그아웃 TC는 TC_SESSION이 없을 때만 돌림");
					await gotoAndSettle(page, path);
					expect(new URL(page.url()).pathname).toBe(path);
				});

				test(`${caseId("P3", 9)} ${label} ${theme} ${title} 조항별 문단 수가 본문 데이터와 같음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					for (const [index, clause] of data.clauses.entries()) {
						const paragraphCount = clause.blocks.filter(
							(block) => block.kind === "paragraph",
						).length;
						await expect(
							page.locator(
								`[data-area="policy-clause-${layout}-${index + 1}"] p`,
							),
						).toHaveCount(paragraphCount);
					}
				});

				test(`${caseId("P3", 10)} ${label} ${theme} ${title} 시행일 줄 위에 임시 초안 안내가 보임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, path);
					const notice = page.locator(
						`[data-area="policy-draft-notice-${layout}"]`,
					);
					await expect(notice).toHaveText(DRAFT_NOTICE);
					const noticeBox = await notice.boundingBox();
					const dateBox = await page
						.locator(`[data-area="policy-effective-date-${layout}"]`)
						.boundingBox();
					expect(
						(noticeBox?.y ?? 0) + (noticeBox?.height ?? 0),
					).toBeLessThanOrEqual(dateBox?.y ?? 0);
				});
			}

			test(`${caseId("P3", 9)} ${label} ${theme} 개인정보처리방침 조항 5에 이전받는 자 네 곳이 나옴`, async ({
				page,
			}) => {
				await gotoAndSettle(page, PRIVACY.path);
				const clause = page.locator(`[data-area="policy-clause-${layout}-5"]`);
				for (const name of ["Oracle", "Anthropic", "Cloudflare", "Sentry"]) {
					await expect(clause).toContainText(name);
				}
			});

			// P4 데이터 출처 화면
			const cards = (page: Page) =>
				page.locator(`[data-area^="data-source-card-${layout}-"]`);

			test(`${caseId("P4", 1)} ${label} ${theme} 카드가 전월세, 매매, 표제부 순서로 세 장이고 다른 출처 카드는 없음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				await expect(cards(page)).toHaveCount(3);
				await expect(cards(page).locator("h2")).toHaveText(
					CARDS.map((card) => card.name),
				);
				await expect(
					page
						.getByTestId(`data-sources-body-${layout}`)
						.getByText(/법령|좌표/),
				).toHaveCount(0);
			});

			test(`${caseId("P4", 2)} ${label} ${theme} 카드의 데이터명과 제공 기관이 본문 문서 표와 같음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				for (const [index, card] of CARDS.entries()) {
					const item = page.locator(
						`[data-area="data-source-card-${layout}-${index + 1}"]`,
					);
					await expect(item).toContainText(card.name);
					await expect(item).toContainText(card.provider);
				}
			});

			test(`${caseId("P4", 3)} ${label} ${theme} 카드에 갱신 주기와 기준 월 줄이 나옴`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				for (const [index, card] of CARDS.entries()) {
					await expect(
						page.locator(
							`[data-area="data-source-card-${layout}-${index + 1}"]`,
						),
					).toContainText(card.update);
				}
			});

			test(`${caseId("P4", 4)} ${label} ${theme} 임시 초안 안내가 한계 안내 위에 보임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				const notice = page.locator(
					`[data-area="data-sources-draft-notice-${layout}"]`,
				);
				await expect(notice).toHaveText(DATA_SOURCES_DRAFT_NOTICE);
				const noticeBox = await notice.boundingBox();
				const limitBox = await page
					.locator(`[data-area="data-sources-notice-${layout}"]`)
					.boundingBox();
				expect(
					(noticeBox?.y ?? 0) + (noticeBox?.height ?? 0),
				).toBeLessThanOrEqual(limitBox?.y ?? 0);
			});

			test(`${caseId("P4", 5)} ${label} ${theme} 카드마다 원본 링크가 새 탭 속성과 본문 문서의 주소로 걸림`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				for (const [index, card] of CARDS.entries()) {
					const link = page
						.locator(`[data-area="data-source-card-${layout}-${index + 1}"]`)
						.getByRole("link", { name: /원본/ });
					await expect(link).toHaveAttribute("href", card.href);
					await expect(link).toHaveAttribute("target", "_blank");
					await expect(link).toHaveAttribute("rel", /noopener/);
					await expect(link).toHaveAttribute("rel", /noreferrer/);
				}
			});

			test(`${caseId("P4", 6)} ${label} ${theme} 한계 안내 세 줄이 본문 문서와 같고 공시가격 링크가 realtyprice.kr임`, async ({
				page,
			}) => {
				await gotoAndSettle(page, DATA_SOURCES.path);
				const notice = page.locator(
					`[data-area="data-sources-notice-${layout}"]`,
				);
				await expect(notice.locator("li")).toHaveText(LIMIT_LINES);
				const link = notice.getByRole("link", {
					name: "부동산공시가격 알리미",
				});
				await expect(link).toHaveAttribute(
					"href",
					"https://www.realtyprice.kr",
				);
				await expect(link).toHaveAttribute("target", "_blank");
			});

			// P6 S6 캔버스 보드 치수와 색. 치수는 라이트 한 벌만 확인함
			const size = isMobile
				? {
						h1: ["22px", "30px"],
						body: ["15px", "25px"],
						notice: ["14px", "21px"],
						clauseTitle: ["17px", "24px"],
						clauseTop: ["28px", "28px"],
						dt: ["13px", "18px"],
						dd: ["14px", "22px"],
						limit: ["14px", "22px"],
					}
				: {
						h1: ["26px", "35px"],
						body: ["16px", "27px"],
						notice: ["15px", "23px"],
						clauseTitle: ["18px", "26px"],
						clauseTop: ["36px", "32px"],
						dt: ["14px", "24px"],
						dd: ["15px", "24px"],
						limit: ["15px", "24px"],
					};
			const policyTokens = POLICY_TOKENS[theme];
			const draftNotice = (page: Page, area: string) =>
				page.locator(`[data-area="${area}-draft-notice-${layout}"]`);

			test(`${caseId("P6", 1)} ${label} ${theme} 임시 초안 안내가 브랜드 테두리 상자이고 정보 아이콘이 있음`, async ({
				page,
			}) => {
				for (const { path, area } of [
					{ path: TERMS.path, area: "policy" },
					{ path: DATA_SOURCES.path, area: "data-sources" },
				]) {
					await gotoAndSettle(page, path);
					const notice = draftNotice(page, area);
					const style = await readStyle(notice, [
						"border-top-width",
						"border-top-color",
						"border-top-left-radius",
						"padding-top",
						"padding-left",
						"background-color",
					]);
					expect(style["border-top-width"]).toBe("1px");
					expect(
						sameColor(style["border-top-color"], policyTokens.borderBrandSolid),
					).toBe(true);
					expect(style["border-top-left-radius"]).toBe("12px");
					expect(style["padding-top"]).toBe("12px");
					expect(style["padding-left"]).toBe("16px");
					expect(
						sameColor(
							style["background-color"],
							policyTokens.bgInformativeWeak,
						),
					).toBe(true);
					const icon = await readBox(notice.locator("svg"));
					expect([icon.width, icon.height]).toEqual([20, 20]);
					const text = await readStyle(notice.locator("p"), [
						"font-size",
						"line-height",
						"font-weight",
						"color",
					]);
					expect([text["font-size"], text["line-height"]]).toEqual(size.notice);
					expect(text["font-weight"]).toBe("500");
					expect(sameColor(text.color, token.fgNeutral)).toBe(true);
				}
			});

			if (theme === "light") {
				test(`${caseId("P6", 2)} ${label} ${theme} 제목 글자와 제목 아래 안내 간격이 보드와 같음`, async ({
					page,
				}) => {
					for (const { path } of ALL_PAGES) {
						await gotoAndSettle(page, path);
						const heading = page.locator("h1:visible");
						const style = await readStyle(heading, [
							"font-size",
							"line-height",
							"font-weight",
						]);
						expect([style["font-size"], style["line-height"]]).toEqual(size.h1);
						expect(style["font-weight"]).toBe("700");
						const headingBox = await readBox(heading);
						const noticeBox = await readBox(
							page.locator(`[data-area$="-draft-notice-${layout}"]`),
						);
						expect(
							noticeBox.y - (headingBox.y + headingBox.height),
						).toBeCloseTo(16, 0);
					}
				});

				test(`${caseId("P6", 3)} ${label} ${theme} 문서 화면 바깥 치수가 보드와 같음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, TERMS.path);
					if (isMobile) {
						const body = page.locator(
							'[data-testid="policy-body-mobile"] > div',
						);
						const style = await readStyle(body, [
							"padding-top",
							"padding-left",
							"padding-bottom",
						]);
						expect([
							style["padding-top"],
							style["padding-left"],
							style["padding-bottom"],
						]).toEqual(["20px", "16px", "48px"]);
						return;
					}
					const column = await readBox(
						page.locator('[data-area="policy-column"]'),
					);
					expect(column.width).toBe(720);
					const card = page.locator('[data-area="policy-column"] > div').last();
					const style = await readStyle(card, [
						"padding-top",
						"padding-left",
						"border-top-left-radius",
						"border-top-width",
						"border-top-color",
						"background-color",
					]);
					expect(style["padding-top"]).toBe("40px");
					expect(style["padding-left"]).toBe("40px");
					expect(style["border-top-left-radius"]).toBe("20px");
					expect(style["border-top-width"]).toBe("1px");
					expect(
						sameColor(style["border-top-color"], policyTokens.strokeMuted),
					).toBe(true);
					expect(sameColor(style["background-color"], token.layerDefault)).toBe(
						true,
					);
				});

				for (const { path, title, toc } of DOCUMENTS) {
					test(`${caseId("P6", 4)} ${label} ${theme} ${title} 목차가 보드의 ${isMobile ? "한 열" : "두 열"} 44px 행임`, async ({
						page,
					}) => {
						await gotoAndSettle(page, path);
						const nav = page.locator(`[data-area="policy-toc-${layout}"]`);
						const items = nav.locator("ol > li");
						const navStyle = await readStyle(nav, [
							"border-top-width",
							"border-top-left-radius",
							"padding-top",
							"background-color",
						]);
						expect(navStyle["border-top-width"]).toBe("1px");
						expect(navStyle["border-top-left-radius"]).toBe("16px");
						expect(navStyle["padding-top"]).toBe(isMobile ? "4px" : "8px");
						expect(
							sameColor(
								navStyle["background-color"],
								policyTokens.bgNeutralWeak,
							),
						).toBe(true);
						const first = await readBox(items.nth(0));
						const second = await readBox(items.nth(1));
						expect(first.height).toBe(44);
						expect(second.height).toBe(44);
						if (isMobile) {
							expect(second.x).toBe(first.x);
							expect(second.y).toBeCloseTo(first.y + 44, 0);
							return;
						}
						const rows = Math.ceil(toc.length / 2);
						const next = await readBox(items.nth(rows));
						expect(second.x).toBe(first.x);
						expect(next.y).toBeCloseTo(first.y, 0);
						expect(next.x - first.x).toBeCloseTo(318, 0);
						const number = await readStyle(
							items.nth(0).locator("span[aria-hidden] > span"),
							["font-size", "font-weight", "color"],
						);
						expect(number["font-size"]).toBe("15px");
						expect(number["font-weight"]).toBe("700");
						expect(sameColor(number.color, policyTokens.fgBrand)).toBe(true);
					});
				}

				test(`${caseId("P6", 5)} ${label} ${theme} 조항 구분선, 제목, 본문 글자가 보드와 같음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, TERMS.path);
					const clause = page.locator(
						`[data-area="policy-clause-${layout}-2"]`,
					);
					const style = await readStyle(clause, [
						"margin-top",
						"padding-top",
						"border-top-width",
						"border-top-color",
					]);
					expect([style["margin-top"], style["padding-top"]]).toEqual(
						size.clauseTop,
					);
					expect(style["border-top-width"]).toBe("1px");
					expect(
						sameColor(style["border-top-color"], policyTokens.strokeMuted),
					).toBe(true);
					const title = await readStyle(clause.locator("h2"), [
						"font-size",
						"line-height",
						"font-weight",
					]);
					expect([title["font-size"], title["line-height"]]).toEqual(
						size.clauseTitle,
					);
					expect(title["font-weight"]).toBe("700");
					const paragraph = await readStyle(clause.locator("p"), [
						"font-size",
						"line-height",
						"color",
					]);
					expect([paragraph["font-size"], paragraph["line-height"]]).toEqual(
						size.body,
					);
					expect(sameColor(paragraph.color, token.fgNeutral)).toBe(true);
				});

				test(`${caseId("P6", 6)} ${label} ${theme} 본문 목록이 글머리 기호 목록이고 부칙이 14px임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, TERMS.path);
					const list = page
						.locator(`[data-area="policy-clause-${layout}-1"] ul`)
						.first();
					const listStyle = await readStyle(list, [
						"list-style-type",
						"padding-left",
					]);
					expect(listStyle["list-style-type"]).toBe("disc");
					expect(listStyle["padding-left"]).toBe("20px");
					const item = await readStyle(list.locator("li").first(), ["display"]);
					expect(item.display).toBe("list-item");
					const addendum = await readStyle(
						page.getByTestId(`policy-body-${layout}`).getByText(/^부칙:/),
						["font-size", "line-height"],
					);
					expect([addendum["font-size"], addendum["line-height"]]).toEqual([
						"14px",
						"22px",
					]);
				});

				test(`${caseId("P6", 7)} ${label} ${theme} 처리 항목이 라벨 값 카드이고 ${isMobile ? "라벨 아래에 값이" : "160px 라벨 열 옆에 값이"} 나옴`, async ({
					page,
				}) => {
					await gotoAndSettle(page, PRIVACY.path);
					const clause = page.locator(
						`[data-area="policy-clause-${layout}-2"]`,
					);
					const card = clause.locator("dl").first();
					const cardStyle = await readStyle(card, [
						"border-top-width",
						"border-top-left-radius",
						"border-top-color",
					]);
					expect(cardStyle["border-top-width"]).toBe("1px");
					expect(cardStyle["border-top-left-radius"]).toBe("12px");
					expect(
						sameColor(cardStyle["border-top-color"], policyTokens.strokeWeak),
					).toBe(true);
					await expect(card.locator("dt")).toHaveCount(4);
					const label = card.locator("dt").first();
					const value = card.locator("dd").first();
					const labelStyle = await readStyle(label, [
						"font-size",
						"line-height",
						"font-weight",
					]);
					const valueStyle = await readStyle(value, [
						"font-size",
						"line-height",
					]);
					expect([labelStyle["font-size"], labelStyle["line-height"]]).toEqual(
						size.dt,
					);
					expect(labelStyle["font-weight"]).toBe("700");
					expect([valueStyle["font-size"], valueStyle["line-height"]]).toEqual(
						size.dd,
					);
					const labelBox = await readBox(label);
					const valueBox = await readBox(value);
					const row = await readStyle(
						card.locator("dt").first().locator(".."),
						["padding-top", "padding-left"],
					);
					expect([row["padding-top"], row["padding-left"]]).toEqual([
						"12px",
						"16px",
					]);
					if (isMobile) {
						expect(valueBox.y).toBeGreaterThanOrEqual(
							labelBox.y + labelBox.height,
						);
						expect(valueBox.x).toBe(labelBox.x);
						return;
					}
					expect(labelBox.width).toBe(160);
					expect(valueBox.x - labelBox.x).toBe(176);
				});

				test(`${caseId("P6", 8)} ${label} ${theme} 처리 위탁이 ${isMobile ? "수탁자별 카드" : "수탁자 표"}이고 국외 이전은 이전받는 자별 카드임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, PRIVACY.path);
					const outsourcing = page.locator(
						`[data-area="policy-clause-${layout}-4"]`,
					);
					if (isMobile) {
						await expect(outsourcing.locator("table")).toHaveCount(0);
						await expect(outsourcing.locator("h3")).toHaveCount(4);
						await expect(outsourcing.locator("dl")).toHaveCount(4);
					} else {
						await expect(outsourcing.locator("h3")).toHaveCount(0);
						await expect(outsourcing.locator("th[scope=col]")).toHaveText([
							"수탁자",
							"위탁 업무",
							"위탁 항목",
							"보유 기간",
						]);
						await expect(outsourcing.locator("tbody tr")).toHaveCount(4);
						await expect(outsourcing.locator("tbody th[scope=row]")).toHaveText(
							[
								"Oracle [임시 계약 법인명 확인 필요]",
								"Anthropic, PBC",
								"Cloudflare, Inc. [2단계 확정 전]",
								"Functional Software, Inc.(Sentry) [2단계 확정 전]",
							],
						);
						const head = await readStyle(outsourcing.locator("thead tr"), [
							"background-color",
						]);
						expect(
							sameColor(head["background-color"], policyTokens.bgNeutralWeak),
						).toBe(true);
						const cell = await readStyle(
							outsourcing.locator("tbody td").first(),
							["padding-top", "padding-left", "vertical-align"],
						);
						expect([
							cell["padding-top"],
							cell["padding-left"],
							cell["vertical-align"],
						]).toEqual(["12px", "12px", "top"]);
						const cellText = await readStyle(
							outsourcing.locator("tbody td span").first(),
							["font-size", "line-height"],
						);
						expect([cellText["font-size"], cellText["line-height"]]).toEqual([
							"14px",
							"22px",
						]);
					}
					const transfer = page.locator(
						`[data-area="policy-clause-${layout}-5"]`,
					);
					await expect(transfer.locator("h3")).toHaveText([
						"Oracle",
						"Anthropic, PBC",
						"Cloudflare, Inc. [2단계 확정 전]",
						"Functional Software, Inc.(Sentry) [2단계 확정 전]",
					]);
					await expect(transfer.locator("dl")).toHaveCount(4);
					const heading = await readStyle(transfer.locator("h3").first(), [
						"font-size",
						"line-height",
						"font-weight",
					]);
					expect([
						heading["font-size"],
						heading["line-height"],
						heading["font-weight"],
					]).toEqual(["15px", "22px", "700"]);
				});

				test(`${caseId("P6", 9)} ${label} ${theme} 출처 카드 치수와 원본 링크가 보드와 같음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, DATA_SOURCES.path);
					const card = page.locator(
						`[data-area="data-source-card-${layout}-1"]`,
					);
					const style = await readStyle(card, [
						"padding-top",
						"padding-left",
						"border-top-left-radius",
						"border-top-color",
					]);
					expect([
						style["padding-top"],
						style["padding-left"],
						style["border-top-left-radius"],
					]).toEqual(
						isMobile ? ["16px", "20px", "16px"] : ["20px", "24px", "20px"],
					);
					expect(
						sameColor(
							style["border-top-color"],
							isMobile ? policyTokens.strokeWeak : policyTokens.strokeMuted,
						),
					).toBe(true);
					const name = await readStyle(card.locator("h2"), [
						"font-size",
						"line-height",
						"font-weight",
					]);
					expect([
						name["font-size"],
						name["line-height"],
						name["font-weight"],
					]).toEqual(["17px", "24px", "700"]);
					const provider = await readStyle(card.locator("p").first(), [
						"font-size",
						"line-height",
					]);
					expect([provider["font-size"], provider["line-height"]]).toEqual([
						"14px",
						"20px",
					]);
					const link = card.getByRole("link", { name: "원본" });
					const linkBox = await readBox(link);
					expect(linkBox.height).toBe(44);
					const linkText = await readStyle(link.locator("span").first(), [
						"color",
						"font-weight",
					]);
					expect(sameColor(linkText.color, policyTokens.fgBrand)).toBe(true);
					expect(linkText["font-weight"]).toBe("700");
					const linkStyle = await readStyle(link, ["padding-left"]);
					expect(linkStyle["padding-left"]).toBe("12px");
					const chevron = await readBox(link.locator("svg"));
					expect([chevron.width, chevron.height]).toEqual([16, 16]);
					const first = await readBox(card);
					const second = await readBox(
						page.locator(`[data-area="data-source-card-${layout}-2"]`),
					);
					expect(second.y - (first.y + first.height)).toBeCloseTo(
						isMobile ? 12 : 16,
						0,
					);
				});

				test(`${caseId("P6", 10)} ${label} ${theme} 한계 안내가 테두리 상자 안 글머리 기호 목록이고 링크가 브랜드 색임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, DATA_SOURCES.path);
					const section = page.locator(
						`[data-area="data-sources-notice-${layout}"]`,
					);
					await expect(section).toHaveAttribute(
						"aria-label",
						"데이터 한계 안내",
					);
					const style = await readStyle(section, [
						"padding-top",
						"padding-left",
						"border-top-left-radius",
						"border-top-color",
					]);
					expect([
						style["padding-top"],
						style["padding-left"],
						style["border-top-left-radius"],
					]).toEqual(
						isMobile ? ["16px", "20px", "16px"] : ["20px", "24px", "16px"],
					);
					expect(
						sameColor(style["border-top-color"], policyTokens.strokeWeak),
					).toBe(true);
					const list = await readStyle(section.locator("ul"), [
						"list-style-type",
						"padding-left",
					]);
					expect(list["list-style-type"]).toBe("disc");
					expect(list["padding-left"]).toBe("20px");
					const text = await readStyle(
						section.locator("li").first().locator("span").first(),
						["font-size", "line-height"],
					);
					expect([text["font-size"], text["line-height"]]).toEqual(size.limit);
					const link = await readStyle(
						section.getByRole("link").locator("span").first(),
						["color", "text-decoration-line"],
					);
					expect(sameColor(link.color, policyTokens.fgBrand)).toBe(true);
					expect(link["text-decoration-line"]).toBe("underline");
				});
			}

			// P5 테마
			if (isMobile) {
				test(`${caseId("P5", 1)} 모바일 ${theme} 본문 글자색이 fg.neutral, 보조 글자색이 fg.neutralMuted, 배경이 bg.layerDefault임`, async ({
					page,
				}) => {
					await gotoAndSettle(page, TERMS.path);
					const read = (selector: string) =>
						page
							.locator(selector)
							.first()
							.evaluate((element) => {
								const computed = getComputedStyle(element);
								return {
									color: computed.color,
									background: computed.backgroundColor,
								};
							});
					const paragraph = await read(
						'[data-area="policy-clause-mobile-1"] p',
					);
					const muted = await read(
						'[data-area="policy-effective-date-mobile"]',
					);
					const body = await read('[data-testid="policy-body-mobile"] > div');
					expect(sameColor(paragraph.color, token.fgNeutral)).toBe(true);
					expect(sameColor(muted.color, token.fgMuted)).toBe(true);
					expect(sameColor(body.background, token.layerDefault)).toBe(true);
				});
				return;
			}

			test(`${caseId("P5", 2)} 데스크톱 ${theme} 하늘빛 배경이 열 바깥에 깔림`, async ({
				page,
			}) => {
				await gotoAndSettle(page, TERMS.path);
				const background = await page.evaluate(
					() => getComputedStyle(document.body).backgroundColor,
				);
				expect(sameColor(background, token.layerDefault)).toBe(false);
				// 하늘빛은 기본 배경에 파란 브랜드 색을 섞은 값이라 파랑 채널이 빨강 채널보다 큼
				const color = parseColor(background);
				expect(color?.b ?? 0).toBeGreaterThan(color?.r ?? 255);
			});
		});
	}
}

// P3-06 마지막 조항, P3-07 뒤로 가기, P3-11 계정 링크는 모바일 라이트 한 벌만 확인함
test.describe("모바일 390x844 light 문서 화면 동작", () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	for (const { path, title } of [TERMS, PRIVACY]) {
		test(`${caseId("P3", 6)} 모바일 ${title} 마지막 조항으로 이동해도 제목이 고정 헤더에 가리지 않음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, path);
			await page
				.getByRole("navigation", { name: "목차" })
				.locator("ol > li")
				.last()
				.getByRole("link")
				.click();
			await page.waitForTimeout(300);
			const lastId = (await page.evaluate(() => location.hash)).slice(1);
			const heading = await page.locator(`#${lastId}-title`).boundingBox();
			const header = await page.locator("header").boundingBox();
			expect(heading?.y ?? 0).toBeGreaterThanOrEqual(
				(header?.y ?? 0) + (header?.height ?? 0),
			);
		});

		test(`${caseId("P3", 11)} 모바일 ${title} 헤더에 계정 링크가 없고 하단 내비게이션 셋째 탭이 이름 로그인으로 로그인에 보냄`, async ({
			page,
		}) => {
			test.skip(LOGGED_IN, "로그아웃 TC는 TC_SESSION이 없을 때만 돌림");
			await gotoAndSettle(page, path);
			await expect(
				page
					.getByTestId("header-mobile")
					.getByRole("link", { name: "로그인", exact: true }),
			).toHaveCount(0);
			const tab = page.locator('[data-area="bottom-nav-me"]');
			await expect(tab).toHaveText("로그인");
			await expect(tab).toHaveAttribute("href", "/login?next=%2Fme");
			await tab.click();
			await expect(page).toHaveURL("/login?next=%2Fme");
		});
	}

	test(`${caseId("P3", 7)} 모바일 뒤로 가기 버튼이 있고 누르면 이전 화면으로 돌아감`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		await page
			.getByTestId("footer-mobile")
			.getByRole("link", { name: "이용약관", exact: true })
			.click();
		await expect(page).toHaveURL(TERMS.path);
		await page.waitForTimeout(500);
		await page
			.getByTestId("header-mobile")
			.getByRole("button", { name: "뒤로 가기" })
			.click();
		await expect(page).toHaveURL("/");
	});

	test(`${caseId("P2", 4)} 모바일 정책 화면의 푸터 링크로 문서끼리 오감`, async ({
		page,
	}) => {
		await gotoAndSettle(page, TERMS.path);
		for (const { path, title } of [PRIVACY, DATA_SOURCES, TERMS]) {
			await page
				.getByTestId("footer-mobile")
				.getByRole("link", { name: title, exact: true })
				.click();
			await expect(page).toHaveURL(path);
			await expectVisibleHeading(page, title);
		}
	});
});
