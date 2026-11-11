// 기대값은 구현이 아니라 설계 문서(2026-11-01-stage1-search-design.md)와 메타데이터 작업 지시 명세에서 가져옴.
// 검색어가 비었거나 공백뿐이면 폼이 제출되지 않음. 제목은 "{화면 제목} | 집씨" 템플릿이고 홈은 "집씨"임.
import { expect } from "@playwright/test";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { readHead } from "./support/readHead";
import { readPngSize } from "./support/readPngSize";
import {
	KEYWORD,
	SEARCH_PATH,
	SEARCH_TITLE,
	SITE_DESCRIPTION,
	SITE_NAME,
} from "./support/searchFixtures";
import { searchForm } from "./support/searchForm";
import { submitSearch } from "./support/submitSearch";
import { test } from "./support/test";
import { DESKTOP, MOBILE } from "./support/viewports";
import { watchKeywordRequests } from "./support/watchKeywordRequests";

const EMPTY_KEYWORDS = [
	{ what: "빈 검색어", value: "" },
	{ what: "공백뿐인 검색어", value: "   " },
];

const SUBMIT_METHODS = [
	{ how: "button", howLabel: "검색 버튼을" },
	{ how: "enter", howLabel: "Enter 키를" },
] as const;

const SCREENS = [
	{ label: "모바일", viewport: MOBILE },
	{ label: "데스크톱", viewport: DESKTOP },
];

// 화면당 폼 케이스는 빈 검색어 2종 x 제출 2종, 검색어 입력 제출 2종, 검색 결과 비움 제출 2종임
const FORM_CASES_PER_SCREEN =
	EMPTY_KEYWORDS.length * SUBMIT_METHODS.length + SUBMIT_METHODS.length * 2;
// 화면당 head 케이스는 홈과 검색 결과 2개임
const HEAD_CASES_PER_SCREEN = 2;

for (const [index, { label, viewport }] of SCREENS.entries()) {
	const formStart = 1 + index * FORM_CASES_PER_SCREEN;
	const headStart = 1 + index * HEAD_CASES_PER_SCREEN;
	test.describe(`${label} ${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		let number = formStart;
		for (const { what, value } of EMPTY_KEYWORDS) {
			for (const { how, howLabel } of SUBMIT_METHODS) {
				test(`${caseId("S1", number++)} ${label} 홈에서 ${what}로 ${howLabel} 누르면 이동하지 않음`, async ({
					page,
				}) => {
					await gotoAndSettle(page, "/");
					await searchForm(page).input.fill(value);
					const requests = watchKeywordRequests(page);
					await submitSearch(page, how);
					await expect.soft(page).toHaveURL("/");
					expect.soft(requests, "keyword 쿼리가 붙은 요청 수").toHaveLength(0);
				});
			}
		}

		for (const { how, howLabel } of SUBMIT_METHODS) {
			test(`${caseId("S1", number++)} ${label} 홈에서 검색어를 입력하고 ${howLabel} 누르면 검색 결과 경로로 이동함`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				await searchForm(page).input.fill(KEYWORD);
				await submitSearch(page, how);
				await expect.soft(page).toHaveURL(SEARCH_PATH);
			});
		}

		for (const { how, howLabel } of SUBMIT_METHODS) {
			test(`${caseId("S1", number++)} ${label} 검색 결과 화면에서 입력을 비우고 ${howLabel} 누르면 이동하지 않음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, SEARCH_PATH);
				await searchForm(page).input.fill("");
				const requests = watchKeywordRequests(page);
				await submitSearch(page, how);
				await expect.soft(page).toHaveURL(SEARCH_PATH);
				expect.soft(requests, "keyword 쿼리가 붙은 요청 수").toHaveLength(0);
			});
		}

		test(`${caseId("M1", headStart)} ${label} 홈의 제목은 집씨이고 설명, OG, 트위터 태그가 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			const head = await readHead(page);
			expect.soft(head.title, "title").toBe(SITE_NAME);
			expect.soft(head.description, "description").toBe(SITE_DESCRIPTION);
			expect.soft(head.ogTitle, "og:title").toBe(SITE_NAME);
			expect.soft(head.ogDescription, "og:description").toBe(SITE_DESCRIPTION);
			expect.soft(head.ogSiteName, "og:site_name").toBe(SITE_NAME);
			expect.soft(head.ogLocale, "og:locale").toBe("ko_KR");
			expect.soft(head.ogType, "og:type").toBe("website");
			expect.soft(head.ogImageWidth, "og:image:width").toBe("1200");
			expect.soft(head.ogImageHeight, "og:image:height").toBe("630");
			expect.soft(head.ogImageAlt, "og:image:alt").toBe(SITE_NAME);
			expect.soft(head.twitterCard, "twitter:card").toBe("summary_large_image");
			expect
				.soft(head.twitterImage, "twitter:image가 og:image와 같음")
				.toBe(head.ogImage);
		});

		test(`${caseId("M1", headStart + 1)} ${label} 검색 결과의 제목은 "망원동 검색 결과 | 집씨"이고 OG 제목과 이미지가 같이 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const head = await readHead(page);
			expect.soft(head.title, "title").toBe(SEARCH_TITLE);
			expect.soft(head.ogTitle, "og:title").toBe(SEARCH_TITLE);
			expect.soft(head.ogSiteName, "og:site_name").toBe(SITE_NAME);
			expect.soft(head.ogLocale, "og:locale").toBe("ko_KR");
			expect.soft(head.ogType, "og:type").toBe("website");
			expect.soft(head.ogDescription, "og:description").toBe(SITE_DESCRIPTION);
			expect.soft(head.ogImageWidth, "og:image:width").toBe("1200");
			expect.soft(head.twitterCard, "twitter:card").toBe("summary_large_image");
			expect
				.soft(head.twitterImage, "twitter:image가 og:image와 같음")
				.toBe(head.ogImage);
		});
	});
}

test.describe(`모바일 ${MOBILE.width}x${MOBILE.height} light 아이콘`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`${caseId("M1", 5)} 아이콘 링크는 icon.svg(image/svg+xml)와 apple-touch-icon(180x180 png)이고 모두 200으로 열림`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		const head = await readHead(page);
		expect
			.soft((head.icon?.href ?? "").split("?")[0], "icon 경로")
			.toBe("/icon.svg");
		expect.soft(head.icon?.type, "icon type").toBe("image/svg+xml");
		expect
			.soft((head.appleIcon?.href ?? "").split("?")[0], "apple-touch-icon 경로")
			.toBe("/apple-icon.png");
		expect
			.soft(head.appleIcon?.sizes, "apple-touch-icon sizes")
			.toBe("180x180");

		expect(head.icon?.href, "icon 링크가 있음").toBeTruthy();
		expect(head.appleIcon?.href, "apple-touch-icon 링크가 있음").toBeTruthy();
		const icon = await page.request.get(head.icon?.href ?? "");
		expect.soft(icon.status(), "icon status").toBe(200);
		expect
			.soft(icon.headers()["content-type"], "icon content-type")
			.toBe("image/svg+xml");
		const apple = await page.request.get(head.appleIcon?.href ?? "");
		expect.soft(apple.status(), "apple-icon status").toBe(200);
		expect
			.soft(apple.headers()["content-type"], "apple-icon content-type")
			.toBe("image/png");
		expect
			.soft(readPngSize(await apple.body()), "apple-icon 크기")
			.toEqual({ width: 180, height: 180 });
	});

	test(`${caseId("M1", 6)} og:image는 절대 주소이고 1200x630 png로 200 열림(홈, 검색 결과 모두)`, async ({
		page,
	}) => {
		for (const path of ["/", SEARCH_PATH]) {
			await gotoAndSettle(page, path);
			const head = await readHead(page);
			expect
				.soft(
					/^https?:\/\//.test(head.ogImage ?? ""),
					`${path} og:image 절대 주소`,
				)
				.toBe(true);
			const response = await page.request.get(head.ogImage ?? "");
			expect.soft(response.status(), `${path} og:image status`).toBe(200);
			expect
				.soft(
					response.headers()["content-type"],
					`${path} og:image content-type`,
				)
				.toBe("image/png");
			expect
				.soft(readPngSize(await response.body()), `${path} og:image 크기`)
				.toEqual({ width: 1200, height: 630 });
		}
	});
});
