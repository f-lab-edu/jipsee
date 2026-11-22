import { expect, type Page } from "@playwright/test";
import { gotoAndSettle } from "./gotoAndSettle";

interface ExpectSingleHeadingOptions {
	checksHtml?: boolean;
	checksVisible?: boolean;
}

/**
 * h1이 화면 크기와 상관없이 하나뿐이고 제목이 보이는지 확인함
 *
 * - DOM의 h1(숨겨진 것 포함), 접근성 트리에 노출된 h1, 서버가 내려준 HTML의 h1이 모두 하나임
 * - 하나뿐인 h1이 보이고 글자가 title과 같음
 * - checksHtml이 false이면 서버 HTML 확인을 건너뜀(개발 서버가 404 본문을 스트리밍으로 보내 HTML에 없을 때)
 * - checksVisible이 false이면 보임과 접근성 트리 확인을 건너뜀(모바일 검색 결과는 설계상 제목 줄을 숨김)
 */
export async function expectSingleHeading(
	page: Page,
	path: string,
	title: string,
	{ checksHtml = true, checksVisible = true }: ExpectSingleHeadingOptions = {},
) {
	await gotoAndSettle(page, path);

	const heading = page.locator("h1");
	await expect(heading, "DOM의 h1 개수").toHaveCount(1);
	await expect(heading, "h1 글자").toHaveText(title);
	if (checksVisible) {
		await expect(heading, "h1이 보임").toBeVisible();
		await expect(
			page.getByRole("heading", { level: 1 }),
			"접근성 트리의 h1 개수",
		).toHaveCount(1);
	}

	if (checksHtml) {
		const html = await (await page.request.get(path)).text();
		expect(html.match(/<h1[\s>]/g) ?? [], "서버 HTML의 h1 개수").toHaveLength(
			1,
		);
	}
}
