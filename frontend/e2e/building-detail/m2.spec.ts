// S2 건물 상세 M2: 사이트 메타데이터 (제목, OG 제목)
// 기대값은 메타데이터 작업 지시 명세에서 가져옴. 제목은 "{건물명 또는 주소} | 집씨"이고 OG 제목도 같음.

import { NAMES } from "../support/buildingDetail/buildingFixtures";
import type { T } from "../support/buildingDetail/makeT";
import { test } from "../support/test";
import { MOBILE } from "../support/viewports";

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
			await t.goto(`/buildings/${id}`);
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
		await t.goto("/buildings/4");
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
});
