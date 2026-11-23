// S2 건물 상세 M2: 사이트 메타데이터 (제목, OG 제목)
// 기대값은 메타데이터 작업 지시 명세에서 가져옴. 제목은 "{건물명 또는 주소} | 집씨"이고 OG 제목도 같음.

import {
	ADDRESS_4_TEXT,
	NAMES,
} from "../support/buildingDetail/buildingFixtures";
import type { T } from "../support/buildingDetail/makeT";
import { buildingPath } from "../support/buildingId";
import { expectSingleHeading } from "../support/expectSingleHeading";
import { test } from "../support/test";
import { DESKTOP, MOBILE } from "../support/viewports";

async function readTitles(t: T) {
	return t.page.evaluate(() => ({
		title: document.title,
		ogTitle:
			document
				.querySelector('meta[property="og:title"]')
				?.getAttribute("content") ?? null,
		twitterTitle:
			document
				.querySelector('meta[name="twitter:title"]')
				?.getAttribute("content") ?? null,
		ogImage:
			document
				.querySelector('meta[property="og:image"]')
				?.getAttribute("content") ?? null,
		canonical:
			document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
			null,
		ogUrl:
			document
				.querySelector('meta[property="og:url"]')
				?.getAttribute("content") ?? null,
		ogSiteName:
			document
				.querySelector('meta[property="og:site_name"]')
				?.getAttribute("content") ?? null,
	}));
}

test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("M2-01 id 1, 2, 3, 5의 제목과 OG 제목은 건물명 | 집씨이고 OG 이미지가 있음", async ({
		t,
	}) => {
		for (const [id, name] of Object.entries(NAMES)) {
			await t.goto(buildingPath(Number(id)));
			const h = await readTitles(t);
			t.eq(`id ${id} title`, h.title, `${name} | 집씨`);
			t.eq(`id ${id} og:title`, h.ogTitle, `${name} | 집씨`);
			t.eq(`id ${id} twitter:title`, h.twitterTitle, `${name} | 집씨`);
			t.eq(`id ${id} og:site_name`, h.ogSiteName, "집씨");
			t.eq(
				`id ${id} og:image 있음`,
				/^https?:\/\/.+opengraph-image/.test(h.ogImage ?? ""),
				true,
			);
		}
	});

	test("M2-02 이름이 없는 id 4의 제목과 OG 제목은 주소 | 집씨", async ({
		t,
	}) => {
		await t.goto(buildingPath(4));
		const h = await readTitles(t);
		t.eq("title 형식", /^.*마포구 망원동 16-2 \| 집씨$/.test(h.title), true);
		t.eq("og:title이 title과 같음", h.ogTitle, h.title);
		t.eq("twitter:title이 title과 같음", h.twitterTitle, h.title);
		t.eq(
			"title에 null이나 undefined가 없음",
			/null|undefined/.test(h.title),
			false,
		);
	});

	test("M2-03 id 1과 4의 대표 주소와 og:url은 사이트 주소의 /buildings/{id}임", async ({
		t,
		baseURL,
	}) => {
		for (const id of [1, 4]) {
			await t.goto(buildingPath(id));
			const h = await readTitles(t);
			t.eq(`id ${id} canonical`, h.canonical, `${baseURL}${buildingPath(id)}`);
			t.eq(`id ${id} og:url`, h.ogUrl, `${baseURL}${buildingPath(id)}`);
		}
	});

	test("M2-04 없는 건물(999)과 잘못된 번호(01)의 404 화면에는 대표 주소가 없음", async ({
		t,
	}) => {
		for (const id of ["999", "01"]) {
			t.eq(`${id} status`, await t.goto(`/buildings/${id}`), 404);
			const h = await readTitles(t);
			t.eq(`${id} canonical 없음`, h.canonical, null);
		}
	});
});

// M2-05 h1은 모바일과 데스크톱 레이아웃을 모두 그려도 DOM과 서버 HTML에 하나뿐임
for (const { label, viewport } of [
	{ label: "모바일", viewport: MOBILE },
	{ label: "데스크톱", viewport: DESKTOP },
]) {
	test.describe(`${label} ${viewport.width}x${viewport.height} light h1`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`M2-05 ${label} id 1, 2, 3, 5의 h1은 DOM과 서버 HTML에 하나뿐이고 글자는 건물명임`, async ({
			page,
		}) => {
			for (const [id, name] of Object.entries(NAMES)) {
				await expectSingleHeading(page, buildingPath(Number(id)), name);
			}
		});

		test(`M2-05 ${label} 이름이 없는 id 4의 h1은 DOM과 서버 HTML에 하나뿐이고 글자는 주소임`, async ({
			page,
		}) => {
			await expectSingleHeading(page, buildingPath(4), ADDRESS_4_TEXT);
		});
	});
}
