// S4 로그인, S5 내 정보 UI TC
// 기대값: 설계 문서(2026-11-08-s4-s5-account-design.md) 5절의 로그인 링크 표와 캔버스 S4, S5 보드. 2026-11-09 피드백이 설계 문서와 다르면 피드백을 따름
// 로그인한 상태의 TC는 앱의 sessionMock이 { provider: "GOOGLE" } 같은 값일 때만 의미가 있어 TC_SESSION=in일 때만 돌림. 기본 실행은 로그아웃 TC만 돎
import { expect } from "@playwright/test";
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
