// 기대값은 구현이 아니라 설계 문서(2026-11-01-stage1-search-design.md)와 메타데이터 작업 지시 명세에서 가져옴.
// 검색어가 비었거나 공백뿐이면 폼이 제출되지 않음. 제목은 "{화면 제목} | 집씨" 템플릿이고 홈은 "집씨"임.
import { expect } from "@playwright/test";
import { caseId } from "./support/caseId";
import { gotoAndSettle } from "./support/gotoAndSettle";
import { readHead } from "./support/readHead";
import { readPngSize } from "./support/readPngSize";
import {
	BARE,
	FULL,
	KEYWORD,
	NO_NAME,
	NO_RESULT_KEYWORD,
	NO_ROAD,
	OTHER_KEYWORD,
	PAGE_SIZE,
	SEARCH_PATH,
	SEARCH_TITLE,
	SITE_DESCRIPTION,
	SITE_NAME,
	TOTAL,
} from "./support/searchFixtures";
import { searchForm } from "./support/searchForm";
import { itemOf, searchResult } from "./support/searchResult";
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
	{ label: "모바일", viewport: MOBILE, layout: "mobile" },
	{ label: "데스크톱", viewport: DESKTOP, layout: "desktop" },
] as const;

for (const { label, viewport, layout } of SCREENS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		for (const { what, value } of EMPTY_KEYWORDS) {
			for (const { how, howLabel } of SUBMIT_METHODS) {
				test(`${caseId("S1", 1)} ${label} 홈에서 ${what}로 ${howLabel} 누르면 이동하지 않음`, async ({
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
			test(`${caseId("S1", 2)} ${label} 홈에서 검색어를 입력하고 ${howLabel} 누르면 검색 결과 경로로 이동함`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				await searchForm(page).input.fill(KEYWORD);
				await submitSearch(page, how);
				await expect.soft(page).toHaveURL(SEARCH_PATH);
				await expect(searchResult(page, layout).items.first()).toBeVisible();
			});
		}

		test(`${caseId("S1", 4)} ${label} 검색 결과 화면에서 다른 검색어를 입력해 제출하면 그 검색어의 결과로 바뀌고 입력창에 검색어가 남음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			await searchForm(page).input.fill(OTHER_KEYWORD);
			await submitSearch(page, "enter");
			await expect(page).toHaveURL(
				`/search?keyword=${encodeURIComponent(OTHER_KEYWORD)}`,
			);
			await expect(searchForm(page).input).toHaveValue(OTHER_KEYWORD);
			await expect(searchResult(page, layout).items.first()).toBeVisible();
		});

		test(`${caseId("S1", 5)} ${label} 일치하는 건물이 없는 검색어를 제출하면 결과 목록 대신 찾을 수 없다는 안내가 나옴`, async ({
			page,
		}) => {
			await gotoAndSettle(page, "/");
			await searchForm(page).input.fill(NO_RESULT_KEYWORD);
			await submitSearch(page, "enter");
			await expect(page).toHaveURL(
				`/search?keyword=${encodeURIComponent(NO_RESULT_KEYWORD)}`,
			);
			await expect(
				page.locator("p:visible", { hasText: "찾을 수 없어요" }).first(),
			).toBeVisible();
			await expect(searchResult(page, layout).items).toHaveCount(0);
		});

		for (const { how, howLabel } of SUBMIT_METHODS) {
			test(`${caseId("S1", 3)} ${label} 검색 결과 화면에서 입력을 비우고 ${howLabel} 누르면 이동하지 않음`, async ({
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

		// <head> 확인은 화면 크기와 상관없으므로 모바일에서만 돌림
		if (layout === "mobile") {
			test(`${caseId("M1", 1)} ${label} 홈의 제목은 집씨이고 설명, OG, 트위터 태그가 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, "/");
				const head = await readHead(page);
				expect.soft(head.title, "title").toBe(SITE_NAME);
				expect.soft(head.description, "description").toBe(SITE_DESCRIPTION);
				expect.soft(head.ogTitle, "og:title").toBe(SITE_NAME);
				expect
					.soft(head.ogDescription, "og:description")
					.toBe(SITE_DESCRIPTION);
				expect.soft(head.ogSiteName, "og:site_name").toBe(SITE_NAME);
				expect.soft(head.ogLocale, "og:locale").toBe("ko_KR");
				expect.soft(head.ogType, "og:type").toBe("website");
				expect.soft(head.ogImageWidth, "og:image:width").toBe("1200");
				expect.soft(head.ogImageHeight, "og:image:height").toBe("630");
				expect.soft(head.ogImageAlt, "og:image:alt").toBe(SITE_NAME);
				expect
					.soft(head.twitterCard, "twitter:card")
					.toBe("summary_large_image");
				expect
					.soft(head.twitterImage, "twitter:image가 og:image와 같음")
					.toBe(head.ogImage);
			});

			test(`${caseId("M1", 2)} ${label} 검색 결과의 제목은 "망원동 검색 결과 | 집씨"이고 OG 제목과 이미지가 같이 있음`, async ({
				page,
			}) => {
				await gotoAndSettle(page, SEARCH_PATH);
				const head = await readHead(page);
				expect.soft(head.title, "title").toBe(SEARCH_TITLE);
				expect.soft(head.ogTitle, "og:title").toBe(SEARCH_TITLE);
				expect.soft(head.ogSiteName, "og:site_name").toBe(SITE_NAME);
				expect.soft(head.ogLocale, "og:locale").toBe("ko_KR");
				expect.soft(head.ogType, "og:type").toBe("website");
				expect
					.soft(head.ogDescription, "og:description")
					.toBe(SITE_DESCRIPTION);
				expect.soft(head.ogImageWidth, "og:image:width").toBe("1200");
				expect
					.soft(head.twitterCard, "twitter:card")
					.toBe("summary_large_image");
				expect
					.soft(head.twitterImage, "twitter:image가 og:image와 같음")
					.toBe(head.ogImage);
			});
		}
	});
}

test.describe(`모바일 ${MOBILE.width}x${MOBILE.height} light 아이콘`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`${caseId("M1", 3)} 아이콘 링크는 icon.svg(image/svg+xml)와 apple-touch-icon(180x180 png)이고 모두 200으로 열림`, async ({
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

	test(`${caseId("M1", 4)} og:image는 절대 주소이고 1200x630 png로 200 열림(홈, 검색 결과 모두)`, async ({
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

	test(`${caseId("M1", 5)} 홈에 매니페스트 링크가 있고 이름, 시작 경로, 표시 방식, 색, 언어가 정해진 값으로 200 열림`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		const head = await readHead(page);
		expect(head.manifest?.href, "manifest 링크가 있음").toBeTruthy();
		const response = await page.request.get(head.manifest?.href ?? "");
		expect.soft(response.status(), "manifest status").toBe(200);
		const body = await response.json();
		expect.soft(body.name, "name").toBe(SITE_NAME);
		expect.soft(body.short_name, "short_name").toBe(SITE_NAME);
		expect.soft(body.description, "description").toBe(SITE_DESCRIPTION);
		expect.soft(body.start_url, "start_url").toBe("/");
		expect.soft(body.display, "display").toBe("standalone");
		expect.soft(body.background_color, "background_color").toBe("#ffffff");
		expect.soft(body.theme_color, "theme_color").toBe("#217CF9");
		expect.soft(body.lang, "lang").toBe("ko");
		expect
			.soft(
				body.icons.map(
					(icon: { sizes: string; purpose: string }) =>
						`${icon.sizes} ${icon.purpose}`,
				),
				"icons",
			)
			.toEqual(["192x192 any", "512x512 any", "512x512 maskable"]);
	});

	test(`${caseId("M1", 6)} 매니페스트의 아이콘 세 개가 각자 크기의 png로 200 열림`, async ({
		page,
	}) => {
		await gotoAndSettle(page, "/");
		const head = await readHead(page);
		const manifest = await (
			await page.request.get(head.manifest?.href ?? "")
		).json();
		expect(manifest.icons, "아이콘 수").toHaveLength(3);
		for (const icon of manifest.icons as { src: string; sizes: string }[]) {
			const response = await page.request.get(icon.src);
			expect.soft(response.status(), `${icon.src} status`).toBe(200);
			expect
				.soft(response.headers()["content-type"], `${icon.src} content-type`)
				.toBe("image/png");
			const size = Number(icon.sizes.split("x")[0]);
			expect
				.soft(readPngSize(await response.body()), `${icon.src} 크기`)
				.toEqual({ width: size, height: size });
		}
	});

	test(`${caseId("M1", 7)} 홈과 검색 결과에 theme-color 메타 태그가 #217CF9로 있음`, async ({
		page,
	}) => {
		for (const path of ["/", SEARCH_PATH]) {
			await gotoAndSettle(page, path);
			const head = await readHead(page);
			expect.soft(head.theme, `${path} theme-color`).toBe("#217CF9");
		}
	});
});

// 검색 결과 더 보기와 주소 두 줄. 기대값은 2026-11-14 오류와 페이지 나눔 설계 5절, 6절과 캔버스 보드 S1P*에서 가져옴
// 목업은 "망원동"에 48건(번호 1~48)이 걸려 20건, 20건, 8건으로 나뉨. 번호 35는 건물명과 도로명 주소가 모두 없음
const MORE_LAYOUTS = [
	{ label: "모바일", viewport: MOBILE, layout: "mobile" },
	{ label: "데스크톱", viewport: DESKTOP, layout: "desktop" },
] as const;
const SEARCH_API = "**/api/buildings/search*";

for (const { label, viewport, layout } of MORE_LAYOUTS) {
	test.describe(`${label} ${viewport.width}x${viewport.height} light 더 보기`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("S1P", 1)} ${label} 처음에는 20건과 더 보기 버튼이 있고 목록 끝 아래에 놓임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { items, moreButton } = searchResult(page, layout);
			await expect(items).toHaveCount(PAGE_SIZE);
			await expect(moreButton).toBeVisible();
			const lastBox = await items.last().boundingBox();
			const buttonBox = await moreButton.boundingBox();
			expect
				.soft(buttonBox?.y ?? 0)
				.toBeGreaterThan((lastBox?.y ?? 0) + (lastBox?.height ?? 0));
		});

		test(`${caseId("S1P", 2)} ${label} 더 보기를 누르면 page=1을 요청해 20건이 목록 끝에 붙고 주소는 그대로임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const requests: string[] = [];
			page.on("request", (request) => {
				if (request.url().includes("/api/buildings/search")) {
					requests.push(decodeURIComponent(new URL(request.url()).search));
				}
			});
			const { items, moreButton } = searchResult(page, layout);
			await moreButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			expect.soft(requests).toEqual(["?keyword=망원동&page=1"]);
			expect.soft(page.url()).toContain(SEARCH_PATH);
			await expect(moreButton).toBeVisible();
			const ids = await items
				.locator('a[href^="/buildings/"]')
				.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
			expect
				.soft(new Set(ids).size, "건물 링크가 겹치지 않음")
				.toBe(PAGE_SIZE * 2);
		});

		test(`${caseId("S1P", 3)} ${label} 새로 붙은 첫 건물 링크로 포커스가 옮겨지고 "20건을 더 불러왔어요"를 알림`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { items, moreButton, announcement } = searchResult(page, layout);
			await moreButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			await expect
				.poll(() =>
					page.evaluate(() => document.activeElement?.getAttribute("href")),
				)
				.toBe(`/buildings/${PAGE_SIZE + 1}`);
			await expect(announcement).toHaveText(`${PAGE_SIZE}건을 더 불러왔어요`);
			expect.soft(await announcement.getAttribute("aria-live")).toBe("polite");
			expect.soft(await announcement.getAttribute("role")).toBe("status");
		});

		test(`${caseId("S1P", 4)} ${label} 마지막 페이지는 8건이 붙고 버튼이 사라지며 8건을 알림`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { items, moreButton, announcement } = searchResult(page, layout);
			await moreButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			await moreButton.click();
			await expect(items).toHaveCount(TOTAL);
			await expect(moreButton).toHaveCount(0);
			await expect(announcement).toHaveText(
				`${TOTAL - PAGE_SIZE * 2}건을 더 불러왔어요`,
			);
		});

		test(`${caseId("S1P", 5)} ${label} 불러오는 중에는 버튼이 비활성화되고 aria-busy와 "불러오는 중" 글자가 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			let release: () => void = () => {};
			const gate = new Promise<void>((resolve) => {
				release = resolve;
			});
			await page.route(SEARCH_API, async (route) => {
				await gate;
				await route.continue();
			});
			const { items, moreButton, loadingButton } = searchResult(page, layout);
			await moreButton.click();
			await expect(loadingButton).toBeDisabled();
			await expect(loadingButton).toHaveAttribute("aria-busy", "true");
			await expect(moreButton).toHaveCount(0);
			release();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			await expect(loadingButton).toHaveCount(0);
		});

		test(`${caseId("S1P", 6)} ${label} 불러오기에 실패하면 오류 띠가 나오고 목록은 그대로이며 다시 시도하면 붙음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			let failures = 1;
			const requests: string[] = [];
			await page.route(SEARCH_API, async (route) => {
				requests.push(
					decodeURIComponent(new URL(route.request().url()).search),
				);
				if (failures > 0) {
					failures -= 1;
					await route.fulfill({ status: 500, body: "x" });
					return;
				}
				await route.continue();
			});
			const { items, moreButton, errorBand, retryButton } = searchResult(
				page,
				layout,
			);
			await moreButton.click();
			await expect(errorBand).toContainText("일시적인 오류가 발생했어요");
			await expect(retryButton).toBeVisible();
			await expect(items).toHaveCount(PAGE_SIZE);
			await expect(moreButton).toHaveCount(0);
			await retryButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			await expect(errorBand).toHaveCount(0);
			expect
				.soft(requests, "다시 시도는 같은 페이지를 요청함")
				.toEqual(["?keyword=망원동&page=1", "?keyword=망원동&page=1"]);
		});

		test(`${caseId("S1P", 7)} ${label} 응답에 이미 있는 건물이 섞여도 번호로 걸러 한 번만 보임`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			await page.route(SEARCH_API, async (route) => {
				const response = await route.fetch();
				const body = await response.json();
				body.buildings[0] = { ...body.buildings[0], id: 1 };
				await route.fulfill({ response, json: body });
			});
			const { items, moreButton, announcement } = searchResult(page, layout);
			await moreButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2 - 1);
			await expect(itemOf(items, 1)).toHaveCount(1);
			await expect(announcement).toHaveText(
				`${PAGE_SIZE - 1}건을 더 불러왔어요`,
			);
		});

		test(`${caseId("S1P", 8)} ${label} 새 검색을 하면 처음 20건부터 다시 시작함`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { items, moreButton } = searchResult(page, layout);
			await moreButton.click();
			await expect(items).toHaveCount(PAGE_SIZE * 2);
			await searchForm(page).input.fill("망원");
			await submitSearch(page, "enter");
			await expect(page).toHaveURL(/keyword=%EB%A7%9D%EC%9B%90$/);
			await expect(items).toHaveCount(PAGE_SIZE);
			await expect(moreButton).toBeVisible();
		});

		test(`${caseId("S1P", 9)} ${label} 결과가 20건 이하이면 더 보기 버튼이 없음`, async ({
			page,
		}) => {
			await gotoAndSettle(
				page,
				"/search?keyword=%EB%A7%9D%EC%9B%90%EB%B9%8C%EB%9D%BC",
			);
			const { items, moreButton } = searchResult(page, layout);
			await expect(items).toHaveCount(2);
			await expect(moreButton).toHaveCount(0);
		});

		test(`${caseId("S1P", 10)} ${label} 건물명과 도로명 주소가 모두 있으면 지번 줄 다음에 도로명 줄이 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const item = itemOf(searchResult(page, layout).items, FULL.id);
			await expect(item.getByText(FULL.name, { exact: true })).toBeVisible();
			const lot = item.getByText("지번", { exact: true });
			const road = item.getByText("도로명", { exact: true });
			await expect(lot).toBeVisible();
			await expect(road).toBeVisible();
			await expect(item).toContainText(FULL.lot);
			await expect(item).toContainText(FULL.road);
			const lotBox = await lot.boundingBox();
			const roadBox = await road.boundingBox();
			expect
				.soft(roadBox?.y ?? 0, "도로명 줄이 지번 줄 아래")
				.toBeGreaterThan(lotBox?.y ?? 0);
			const lotText = await item
				.getByText(FULL.lot, { exact: true })
				.boundingBox();
			const roadText = await item
				.getByText(FULL.road, { exact: true })
				.boundingBox();
			expect.soft(roadText?.x, "두 주소의 시작 위치가 같음").toBe(lotText?.x);
			const labelBox = await road.locator("..").boundingBox();
			expect.soft(labelBox?.width, "표시 상자 폭 44").toBe(44);
		});

		test(`${caseId("S1P", 11)} ${label} 도로명 주소가 null이면 지번 줄만 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const item = itemOf(searchResult(page, layout).items, NO_ROAD.id);
			await expect(item.getByText("지번", { exact: true })).toBeVisible();
			await expect(item.getByText("도로명", { exact: true })).toHaveCount(0);
			await expect(item).toContainText(NO_ROAD.lot);
		});

		test(`${caseId("S1P", 12)} ${label} 건물명이 없으면 지번이 제목이고 도로명 줄만 있으며 둘 다 없으면 제목만 있음`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { items, moreButton } = searchResult(page, layout);
			const nameless = itemOf(items, NO_NAME.id);
			await expect(
				nameless.getByText(NO_NAME.lot, { exact: true }),
			).toHaveCount(1);
			await expect(nameless.getByText("지번", { exact: true })).toHaveCount(0);
			await expect(nameless.getByText("도로명", { exact: true })).toBeVisible();
			await expect(nameless).toContainText(NO_NAME.road);
			await moreButton.click();
			const bare = itemOf(items, BARE.id);
			await expect(bare).toHaveCount(1);
			await expect(bare.getByText(BARE.lot, { exact: true })).toHaveCount(1);
			await expect(bare.getByText("지번", { exact: true })).toHaveCount(0);
			await expect(bare.getByText("도로명", { exact: true })).toHaveCount(0);
		});

		test(`${caseId("S1P", 13)} ${label} 더 보기 버튼은 높이 48, 모서리 12, 글자 15 굵기 700이고 ${layout === "mobile" ? "폭이 열을 꽉 채움" : "폭 240으로 가운데에 놓임"}`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			const { root, moreButton } = searchResult(page, layout);
			const box = await moreButton.boundingBox();
			const rootBox = await root.boundingBox();
			const style = await moreButton.evaluate((element) => {
				const computed = getComputedStyle(element);
				const text = getComputedStyle(element.querySelector("span") ?? element);
				return {
					radius: computed.borderTopLeftRadius,
					border: computed.borderTopWidth,
					fontSize: text.fontSize,
					fontWeight: text.fontWeight,
				};
			});
			expect.soft(box?.height).toBe(48);
			expect.soft(style).toEqual({
				radius: "12px",
				border: "1px",
				fontSize: "15px",
				fontWeight: "700",
			});
			if (layout === "mobile") {
				expect.soft(box?.width, "열 폭 390에서 좌우 16").toBe(358);
				expect.soft(box?.x).toBe(16);
				return;
			}
			expect.soft(box?.width).toBe(240);
			const buttonCenter = (box?.x ?? 0) + (box?.width ?? 0) / 2;
			const rootCenter = (rootBox?.x ?? 0) + (rootBox?.width ?? 0) / 2;
			expect.soft(Math.abs(buttonCenter - rootCenter)).toBeLessThanOrEqual(1);
		});

		test(`${caseId("S1P", 14)} ${label} 오류 띠는 모서리 14에 오류 배경이고 ${layout === "mobile" ? "글자와 버튼이 위아래로 쌓임" : "글자와 버튼이 한 줄에 있음"}`, async ({
			page,
		}) => {
			await gotoAndSettle(page, SEARCH_PATH);
			await page.route(SEARCH_API, (route) =>
				route.fulfill({ status: 500, body: "x" }),
			);
			const { moreButton, errorBand, retryButton } = searchResult(page, layout);
			await moreButton.click();
			await expect(errorBand).toBeVisible();
			const band = await errorBand.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					radius: computed.borderTopLeftRadius,
					direction: computed.flexDirection,
				};
			});
			expect.soft(band.radius).toBe("14px");
			expect.soft(band.direction).toBe(layout === "mobile" ? "column" : "row");
			const textBox = await errorBand
				.getByText("일시적인 오류가 발생했어요")
				.boundingBox();
			const buttonBox = await retryButton.boundingBox();
			expect.soft(buttonBox?.height).toBe(44);
			if (layout === "mobile") {
				expect
					.soft(buttonBox?.y ?? 0)
					.toBeGreaterThan((textBox?.y ?? 0) + (textBox?.height ?? 0));
				return;
			}
			expect
				.soft(buttonBox?.x ?? 0)
				.toBeGreaterThan((textBox?.x ?? 0) + (textBox?.width ?? 0));
		});
	});
}
