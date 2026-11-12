// S2 건물 상세 C3: 라우트 상태, 제목, 헤더, 컬럼 폭, 배경, 푸터 위치, 가로 스크롤, 뒤로 가기, 콘솔, 긴 제목
// 기대값은 구현이 아니라 설계 문서(2026-11-06-stage1-building-detail-design.md)와 캔버스 보드에서 가져옴.
// 우선순위: 설계 11절 > 12절 > 캔버스 > 나머지.

import {
	ADDRESS_4,
	NAMES,
	NOT_FOUND,
	OK_IDS,
} from "../support/buildingDetail/buildingFixtures";
import type { T } from "../support/buildingDetail/makeT";
import { sameColor } from "../support/buildingDetail/sameColor";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { SEARCH_PATH } from "../support/searchFixtures";
import { test } from "../support/test";
import { DESKTOP, MOBILE } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

// 상태 코드와 탭 제목
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	for (const [index, id] of OK_IDS.entries()) {
		test(`${caseId("C3", 1 + index)} /buildings/${id}는 200을 반환함`, async ({
			t,
		}) => {
			t.eq("status", await t.goto(`/buildings/${id}`, 200), 200);
		});
	}
	for (const [index, seg] of NOT_FOUND.entries()) {
		test(`${caseId("C3", 6 + index)} /buildings/${seg}는 404를 반환하고 404 화면이 나옴`, async ({
			t,
		}) => {
			t.eq("status", await t.goto(`/buildings/${seg}`, 300), 404);
			const m = await t.measure();
			t.ok(
				"404 화면 문구",
				/404/.test(m.bodyText),
				m.bodyText.slice(0, 60),
				"본문에 404가 있음",
			);
			t.eq(
				"건물 제목 h1 없음",
				m.h1s.filter((h) => h.inHeader || h.inMain).length,
				0,
			);
		});
	}
	test("C3-13 브라우저 탭 제목은 건물명 | 집씨임 (C11 메타데이터 명세로 갱신)", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		t.eq("document.title", (await t.measure()).title, "망원빌라 | 집씨");
	});
});

// 제목과 대체 제목
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C3-14 모바일에서 건물명이 있으면 본문 카드 첫 줄 제목이 건물명이고 헤더에 제목이 없음 (2026-11-09 피드백 7번)", async ({
		t,
	}) => {
		for (const [id, name] of Object.entries(NAMES)) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.measure();
			t.eq(`id ${id} h1 개수`, m.h1s.length, 1);
			t.eq(`id ${id} h1 글자`, m.h1s[0]?.text, name);
			t.eq(
				`id ${id} h1이 헤더 밖 main 안에 있음`,
				[m.h1s[0]?.inHeader, m.h1s[0]?.inMain],
				[false, true],
			);
			t.ok(
				`id ${id} 헤더 안에 건물명 없음`,
				!(m.headerText ?? "").includes(name),
				m.headerText,
				"로고와 계정 링크만 있음",
			);
		}
	});
	test("C3-15 모바일에서 건물명이 없으면 본문 카드 첫 줄 제목이 주소이고 부제가 없음 (2026-11-09 피드백 7번)", async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.measure();
		t.eq("h1 개수", m.h1s.length, 1);
		t.ok(
			"h1 글자",
			ADDRESS_4.test(m.h1s[0]?.text || ""),
			m.h1s[0]?.text,
			"마포구 망원동 16-2로 끝남",
		);
		t.eq(
			"h1이 헤더 밖 main 안에 있음",
			[m.h1s[0]?.inHeader, m.h1s[0]?.inMain],
			[false, true],
		);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C3-16 데스크톱에서 건물명이 있으면 제목이 건물명이고 주소 부제가 있음", async ({
		t,
	}) => {
		for (const [id, name] of Object.entries(NAMES)) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.measure();
			t.eq(`id ${id} h1 글자`, m.h1s[0]?.text, name);
			t.ok(
				`id ${id} 주소 부제`,
				!!m.addr && /망원동/.test(m.addr.text),
				m.addr?.text,
				"망원동이 들어간 주소가 제목 오른쪽에 있음",
			);
		}
	});
	test("C3-17 데스크톱에서 건물명이 없으면 제목이 주소이고 주소 부제가 없음", async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.measure();
		t.ok(
			"h1 글자",
			ADDRESS_4.test(m.h1s[0]?.text || ""),
			m.h1s[0]?.text,
			"마포구 망원동 16-2로 끝남",
		);
		t.eq("제목 줄 안 글자 전체", m.wrapText, m.h1s[0]?.text);
		t.eq("주소 부제", m.addr ?? null, null);
		t.eq("h1 글자 크기", m.h1s[0]?.fs, "28px");
	});
});

// 모바일 헤더
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} ${theme}`, () => {
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C3", 18 + 2 * themeIndex)} 모바일 로고 헤더의 크기, 뒤로 가기 버튼 위치, 본문 첫 줄 제목 글자가 설계와 같음 (${theme}, 2026-11-09 피드백 7번)`, async ({
			t,
		}) => {
			test.skip(
				process.env.TC_SESSION === "in",
				"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
			);
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.eq("보이는 레이아웃의 헤더 개수", m.headerCount, 1);
			// 높이는 로고 줄 56에 아래 테두리 1을 더한 값임(2026-11-13 헤더 구분선)
			t.near("헤더 높이", m.header?.h, 57);
			t.near("헤더 y", m.header?.y, 0);
			t.near("헤더 폭", m.header?.w, 390);
			t.near("헤더 아래 border 두께 1", m.headerBorder?.w, 1);
			t.color(
				"헤더 아래 border stroke.neutralMuted",
				m.headerBorder?.color,
				t.tokens.strokeMuted,
			);
			t.eq("보이는 뒤로 가기 버튼 개수", m.backs.length, 1);
			const b = m.backs[0];
			t.near("뒤로 가기 w", b?.rect.w, 44);
			t.near("뒤로 가기 h", b?.rect.h, 44);
			t.near("뒤로 가기 x (gutter 16, margin-left -10)", b?.rect.x, 6);
			t.near("뒤로 가기 y (헤더 56 가운데)", b?.rect.y, 6);
			t.eq("보이는 h1 개수", m.h1s.length, 1);
			const h = m.h1s[0];
			t.eq("h1 글자", h?.text, "망원빌라");
			t.near("h1 x (gutter 16)", h?.rect.x, 16);
			t.near(
				"h1 y (헤더 아래, 위 padding 20)",
				h?.rect.y,
				(m.header?.b ?? Number.NaN) + 20,
			);
			t.eq("h1 글자 크기", h?.fs, "18px");
			t.eq("h1 굵기", h?.fw, "700");
			t.eq("h1 줄 높이", h?.lh, "24px");
			t.near("h1 높이(한 줄)", h?.rect.h, 24);
			t.eq("모바일 헤더에 로고 링크 하나", m.logoVisible, 1);
			t.eq(
				"모바일 헤더에 로그인 링크 없음(2026-11-12 하단 내비게이션 결정 3)",
				m.loginVisible,
				0,
			);
			t.eq("모바일 헤더에 내 정보 링크 없음", m.myInfoVisible, 0);
		});
		test(`${caseId("C3", 19 + 2 * themeIndex)} 모바일 헤더의 배경과 제목 색이 토큰과 같음 (${theme}, 2026-11-09 피드백 7번)`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.color(
				"헤더 배경이 흰 열 배경 bg.layerDefault(2026-11-13)",
				m.bgHeader,
				t.tokens.layerDefault,
			);
			t.color("h1 색 fg.neutral", m.h1s[0]?.color, t.tokens.fgNeutral);
		});
	});
}

// 데스크톱 헤더와 제목 줄
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C3", 22 + 4 * themeIndex)} 데스크톱 로고 헤더가 높이 64에 로그인 링크를 보여줌 (${theme})`, async ({
			t,
		}) => {
			test.skip(
				process.env.TC_SESSION === "in",
				"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
			);
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.near("헤더 높이", m.header?.h, 64);
			t.eq("로고 링크 개수", m.logoVisible, 1);
			t.eq("로그인 버튼 개수", m.loginVisible, 1);
			t.eq("내 정보 버튼 개수", m.myInfoVisible, 0);
			t.color("헤더 배경 bg.layerDefault", m.bgHeader, t.tokens.layerDefault);
			t.color(
				"헤더 아래 border stroke.neutralMuted",
				m.headerBorder?.color,
				t.tokens.strokeMuted,
			);
		});
		test(`${caseId("C3", 23 + 4 * themeIndex)} 데스크톱 제목 줄의 뒤로 가기 원형, 제목, 주소 크기와 위치가 캔버스와 같음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.eq("보이는 뒤로 가기 버튼 개수", m.backs.length, 1);
			const b = m.backs[0];
			t.near("뒤로 가기 w", b?.rect.w, 44);
			t.near("뒤로 가기 h", b?.rect.h, 44);
			t.near("뒤로 가기 x (컨테이너 좌 120 + padding 24)", b?.rect.x, 144);
			t.near(
				"뒤로 가기 y (헤더 아래 + padding 28)",
				b?.rect.y,
				(m.header?.b ?? Number.NaN) + 28,
			);
			const r = Number.parseFloat(b?.radius ?? "");
			t.ok(
				"뒤로 가기 원형",
				b?.radius === "50%" || r >= 22,
				b?.radius,
				"둥글기 full(22 이상)",
			);
			const h = m.h1s[0];
			t.eq("보이는 h1 개수", m.h1s.length, 1);
			t.near(
				"h1 x (원형 오른쪽 + 12)",
				h?.rect.x,
				(b?.rect.r ?? Number.NaN) + 12,
			);
			t.eq("h1 글자 크기", h?.fs, "28px");
			t.eq("h1 굵기", h?.fw, "700");
			t.eq("h1 줄 높이", h?.lh, "38px");
			t.near(
				"h1 세로 가운데가 원형과 같음",
				(h?.rect.y ?? Number.NaN) + (h?.rect.h ?? Number.NaN) / 2,
				(b?.rect.y ?? Number.NaN) + 22,
			);
			t.ok("주소 부제", !!m.addr, m.addr ?? null, "제목 오른쪽에 주소가 있음");
			t.eq("주소 글자 크기", m.addr?.fs, "16px");
			t.eq("주소 줄 높이", m.addr?.lh, "24px");
			t.eq("주소 굵기", m.addr?.fw, "400");
			t.near(
				"제목과 주소 간격",
				(m.addr?.textLeft ?? Number.NaN) - (m.h1TextRight ?? Number.NaN),
				12,
			);
			t.eq("제목 줄 래퍼 align-items", m.wrapAlign, "baseline");
			t.near(
				"제목과 주소의 기준선 차이",
				(m.baselineAddr ?? Number.NaN) - (m.baselineH1 ?? Number.NaN),
				0,
			);
		});
		test(`${caseId("C3", 24 + 4 * themeIndex)} 데스크톱 제목 줄의 원형 배경, 제목 색, 주소 색이 토큰과 같음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.color(
				"원형 배경 bg.layerDefault",
				m.backs[0]?.bg,
				t.tokens.layerDefault,
			);
			t.color("h1 색 fg.neutral", m.h1s[0]?.color, t.tokens.fgNeutral);
			t.color("주소 색 fg.neutralMuted", m.addr?.color, t.tokens.fgMuted);
		});
		test(`${caseId("C3", 25 + 4 * themeIndex)} 데스크톱에서 건물명이 없으면 주소 부제 없이 제목 줄이 같은 크기를 유지함 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/4");
			const m = await t.measure();
			t.eq("주소 부제", m.addr ?? null, null);
			t.near("h1 x", m.h1s[0]?.rect.x, (m.backs[0]?.rect.r ?? Number.NaN) + 12);
			t.eq("h1 글자 크기", m.h1s[0]?.fs, "28px");
		});
	});
}

// 컬럼 폭
for (const [index, [w, expected]] of [
	[390, 390],
	[600, 480],
	[800, 720],
	[1000, 720],
	[1279, 720],
	[1280, 1280],
	[1440, 1440],
].entries()) {
	const label = expected === w ? `전체 폭(${w})` : `${expected}`;
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C3", 30 + index)} ${w}px에서 컬럼 폭이 ${label}임`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.near("컬럼 폭", m.column?.w, expected);
			t.near(
				"컬럼 가운데 정렬",
				(m.column?.x ?? Number.NaN) + (m.column?.w ?? Number.NaN) / 2,
				w / 2,
			);
		});
	});
}

// 1279와 1280 경계에서 한 번에 바뀜
test.describe("1279x900 light", () => {
	test.use({ viewport: { width: 1279, height: 900 }, colorScheme: "light" });

	test("C3-37 1279px와 1280px 사이에서 모바일과 데스크톱 레이아웃이 한 번에 바뀌고 하나만 보임", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const step = async (label: string, w: number, expectDesktop: boolean) => {
			await t.page.setViewportSize({ width: w, height: 900 });
			await t.page.waitForTimeout(250);
			const m = await t.measure();
			const h1 = m.h1s[0];
			let h1Place = "none";
			if (h1?.inMain) h1Place = "main";
			t.eq(`${label} 보이는 h1 개수`, m.h1s.length, 1);
			t.eq(`${label} 보이는 뒤로 가기 버튼 개수`, m.backs.length, 1);
			t.eq(`${label} 로고 링크 개수`, m.logoVisible, 1);
			t.eq(`${label} h1 위치`, h1Place, "main");
			t.near(`${label} 헤더 높이`, m.header?.h, expectDesktop ? 64 : 56);
		};
		await step("1279", 1279, false);
		await step("1280", 1280, true);
		await step("다시 1279", 1279, false);
	});
});

// S1 검색 화면의 푸터 배경 (S2 푸터가 S1 Footer 그대로인지 비교하는 기준)
async function s1FooterBg(t: T) {
	await t.goto(SEARCH_PATH, 700);
	return t.page.evaluate(() => {
		for (
			let n: Element | null = document.querySelector("footer");
			n;
			n = n.parentElement
		) {
			const c = getComputedStyle(n).backgroundColor;
			if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
		}
		return "transparent";
	});
}

// 배경
async function bgNarrow(t: T) {
	await t.goto("/buildings/1");
	const m = await t.measure();
	t.color(
		"헤더 배경 bg.layerDefault(2026-11-13 흰 열)",
		m.bgHeader,
		t.tokens.layerDefault,
	);
	t.color(
		"main 오른쪽 끝 배경 bg.layerDefault(흰 열)",
		m.bgMain,
		t.tokens.layerDefault,
	);
	const cardBg = await t.page.evaluate(() => {
		const card = document.querySelector(
			'[data-area="building-body-mobile"] > *',
		);
		return card ? getComputedStyle(card).backgroundColor : "";
	});
	t.color("본문 카드 bg.layerDefault", cardBg, t.tokens.layerDefault);
	t.color(
		"푸터 배경 bg.layerDefault(2026-11-13 흰 열)",
		m.bgFooter,
		t.tokens.layerDefault,
	);
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C3-38 390px에서 헤더, 본문, 푸터가 모두 흰 열 배경 토큰임 (light)", async ({
		t,
	}) => {
		await bgNarrow(t);
	});
});
// 1280px 미만 흰 열. main에 카드 모양이 없고 열 폭을 그대로 씀 (2026-11-13 설계 10.1절)
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} ${theme} 본문 카드`, () => {
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C3", 70 + themeIndex)} 390px에서 main이 좌우 여백 0, border 0, 모서리 0으로 열 폭 390을 그대로 씀 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const card = await t.page.evaluate(() => {
				const el = document.querySelector("main");
				if (!el) return null;
				const c = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				return {
					x: r.x,
					w: r.width,
					bw: c.borderTopWidth,
					bc: c.borderTopColor,
					radius: c.borderTopLeftRadius,
					overflow: c.overflow,
				};
			});
			t.ok("main이 있음", !!card, card, "있음");
			t.near("main x", card?.x, 0, 0.5);
			t.near("main w", card?.w, MOBILE.width, 0.5);
			t.eq("main border 두께", card?.bw, "0px");
			t.eq("main 모서리", card?.radius, "0px");
		});
	});
}

test.describe(`${MOBILE.width}x${MOBILE.height} dark`, () => {
	test.use({ viewport: MOBILE, colorScheme: "dark" });

	test("C3-39 390px에서 헤더, 본문, 푸터가 모두 흰 열 배경 토큰임 (dark)", async ({
		t,
	}) => {
		await bgNarrow(t);
	});
});
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`768x900 ${theme}`, () => {
		test.use({ viewport: { width: 768, height: 900 }, colorScheme: theme });

		test(`${caseId("C3", 40 + 2 * themeIndex)} 768px에서 페이지 바깥만 하늘빛이고 흰 열 안의 헤더, 본문, 푸터는 흰색이며 컬럼은 border가 없음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.ok(
				"하늘빛 토큰이 흰색과 다름",
				!sameColor(m.tint, t.tokens.layerDefault),
				m.tint,
				"bg.layerDefault와 다름",
			);
			t.color("컬럼 바깥 페이지 배경 brand-tint", m.bgOutside, m.tint);
			t.eq("컬럼 border 두께", m.columnBorders, ["0px", "0px", "0px", "0px"]);
			t.eq("컬럼 box-shadow", m.columnShadow, "none");
			t.color(
				"컬럼 안 헤더 bg.layerDefault",
				m.bgHeader,
				t.tokens.layerDefault,
			);
			t.color("컬럼 안 main bg.layerDefault", m.bgMain, t.tokens.layerDefault);
			t.color("main bg.layerDefault", m.bgCard, t.tokens.layerDefault);
			t.color("푸터 bg.layerDefault", m.bgFooter, t.tokens.layerDefault);
		});
	});
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C3", 41 + 2 * themeIndex)} 1440px에서 페이지는 하늘빛이고 헤더와 푸터는 흰 배경임 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measure();
			t.ok(
				"하늘빛 토큰이 흰색과 다름",
				!sameColor(m.tint, t.tokens.layerDefault),
				m.tint,
				"bg.layerDefault와 다름",
			);
			t.color("body 배경 brand-tint (사용자 결정 1)", m.bodyBg, m.tint);
			t.color("main 영역 배경 brand-tint", m.bgMain, m.tint);
			t.color("헤더 bg.layerDefault", m.bgHeader, t.tokens.layerDefault);
			// 설계 12절 10번: 푸터는 S1 Footer를 그대로 씀. 7절의 layerDefault보다 12절이 우선하므로 S1 화면의 푸터 배경과 같아야 함
			const s1Footer = await s1FooterBg(t);
			t.color("푸터 배경이 S1 Footer와 같음 (12절 10번)", m.bgFooter, s1Footer);
		});
	});
}

// 푸터 위치
// 거래 이력 섹션(C6)이 생긴 뒤 모바일 id 1은 1200보다 길어져서 id 3으로 바꿨고, 주변 거래 섹션(C10)이 생긴 뒤 id 3도 1343이 되어
// 모바일은 가장 짧은 id 4(위치 정보 없음, 캔버스 높이 1470)에 뷰포트 높이 1800으로 둠. 이후 커밋이 길이를 늘려도 id 4는 이 안에 들어옴
// 주변 거래 목록(C11)이 생긴 뒤 데스크톱 id 1도 2200을 넘어서 데스크톱도 id 4(캔버스 높이 1030)로 바꿈
// 2026-11-13 이후: 모바일은 푸터가 하단 내비게이션(위 테두리 1과 탭 56) 바로 위에 있고 질문 하단 바는 푸터 위에 있으므로 푸터 아래 끝이 내비게이션 위에 닿음
for (const [index, [w, h, id, bar]] of [
	[390, 1800, 4, 57],
	[1440, 1400, 4, 0],
].entries()) {
	test.describe(`${w}x${h} light`, () => {
		test.use({ viewport: { width: w, height: h }, colorScheme: "light" });

		test(`${caseId("C3", 44 + index)} ${w}x${h}에서 본문이 짧으면 푸터가 화면 맨 아래에 붙음${bar ? " (내비게이션 위)" : ""}`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`);
			const m = await t.measure();
			t.near("푸터 아래 끝", m.footer?.b, m.vh - bar);
			t.ok(
				"세로 스크롤 없음",
				m.scrollH <= m.vh + 1,
				m.scrollH,
				`문서 높이 ≤ ${m.vh}`,
			);
		});
	});
}

// 가로 스크롤
for (const [index, w] of [320, 390, 768, 1280, 1440].entries()) {
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C3", 46 + index)} ${w}px에서 가로 스크롤이 없음`, async ({
			t,
		}) => {
			for (const id of [1, 4]) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await t.measure();
				t.ok(
					`id ${id} 가로 스크롤`,
					m.scrollW <= m.vw,
					m.scrollW,
					`문서 폭 ≤ ${m.vw}`,
				);
			}
		});
	});
}

// 중복 id, h1, main
for (const [index, [label, viewport]] of (
	[
		["390", MOBILE],
		["1440", DESKTOP],
	] as const
).entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C3", 51 + 2 * index)} ${label}px에서 문서에 같은 id가 중복되지 않음`, async ({
			t,
		}) => {
			for (const id of OK_IDS) {
				await t.goto(`/buildings/${id}`, 400);
				t.eq(`id ${id} 중복 id`, (await t.measure()).dupIds, []);
			}
		});
		test(`${caseId("C3", 52 + 2 * index)} ${label}px에서 보이는 h1이 하나이고 main이 하나임`, async ({
			t,
		}) => {
			for (const id of OK_IDS) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await t.measure();
				t.eq(`id ${id} 보이는 h1`, m.h1s.length, 1);
				t.eq(`id ${id} main`, m.mainCount, 1);
			}
		});
	});
}

// 뒤로 가기 버튼
async function openFirstBuilding(t: T) {
	await t.goto(SEARCH_PATH, 1000);
	const link = t.page.locator('a[href^="/buildings/"]:visible').first();
	await link.click();
	await t.page.waitForURL(/\/buildings\/\d+/);
	await t.page.waitForTimeout(700);
}
function expectSearchPage(t: T) {
	const u = new URL(t.page.url());
	t.eq("돌아온 경로", u.pathname, "/search");
	t.eq("돌아온 keyword", u.searchParams.get("keyword"), "망원동");
}
for (const [index, [label, viewport]] of (
	[
		["390", MOBILE],
		["1440", DESKTOP],
	] as const
).entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C3", 55 + 2 * index)} ${label}px에서 검색 결과의 첫 건물을 열고 뒤로 가기를 누르면 검색 결과로 돌아감`, async ({
			t,
		}) => {
			await openFirstBuilding(t);
			t.ok(
				"건물 상세 화면",
				/\/buildings\/\d+/.test(t.page.url()),
				t.page.url(),
				"/buildings/{id}",
			);
			await t.page.getByRole("button", { name: "뒤로 가기" }).click();
			await t.page.waitForURL(/\/search/);
			expectSearchPage(t);
		});
		test(`${caseId("C3", 56 + 2 * index)} ${label}px에서 뒤로 가기 버튼이 Tab으로 포커스되고 이름이 있으며 Enter로 동작함`, async ({
			t,
		}) => {
			await openFirstBuilding(t);
			const btn = t.page.getByRole("button", { name: "뒤로 가기" });
			t.eq("이름이 뒤로 가기인 버튼 개수", await btn.count(), 1);
			await t.page.evaluate(() => document.body.focus());
			let focused = false;
			for (let i = 0; i < 8 && !focused; i++) {
				await t.page.keyboard.press("Tab");
				focused = await t.page.evaluate(
					() =>
						document.activeElement?.getAttribute("aria-label") === "뒤로 가기",
				);
			}
			t.ok(
				"Tab 8번 안에 포커스",
				focused,
				focused,
				"뒤로 가기 버튼에 포커스가 옴",
			);
			await t.page.keyboard.press("Enter");
			await t.page.waitForURL(/\/search/, { timeout: 8000 });
			expectSearchPage(t);
		});
	});
}

// 로그인하지 않은 상태의 헤더
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C3-59 로그인하지 않으면 데스크톱 헤더에 로그인이 보이고 내 정보는 없음", async ({
		t,
	}) => {
		test.skip(
			process.env.TC_SESSION === "in",
			"로그아웃 TC는 TC_SESSION이 없을 때만 돌림",
		);
		await t.goto("/buildings/1");
		const m = await t.measure();
		t.eq("로그인", m.loginVisible, 1);
		t.eq("내 정보", m.myInfoVisible, 0);
	});
});

// 콘솔 오류와 hydration 경고
for (const [index, [label, viewport, theme]] of (
	[
		["390", MOBILE, "light"],
		["390", MOBILE, "dark"],
		["1440", DESKTOP, "light"],
		["1440", DESKTOP, "dark"],
	] as const
).entries()) {
	test.describe(`${viewport.width}x${viewport.height} ${theme}`, () => {
		test.use({ viewport, colorScheme: theme });

		test(`${caseId("C3", 60 + index)} ${label}px ${theme}에서 모든 라우트에 콘솔 오류와 hydration 경고가 없음`, async ({
			t,
		}) => {
			const routes = [
				...OK_IDS.map((i) => `/buildings/${i}`),
				...NOT_FOUND.map((s) => `/buildings/${s}`),
			];
			for (const r of routes) {
				t.issues.length = 0;
				await t.goto(r, 1500);
				for (const i of t.issues) t.fail(`${r}: ${i}`);
			}
		});
	});
}

// 긴 제목: 49자 공백 없는 제목을 DOM에 넣어도 한 줄 말줄임이고 주소는 줄어들지 않음 (목업 데이터를 바꿀 수 없어 h1 글자를 직접 바꿈)
for (const [index, w] of [1280, 1440].entries()) {
	test.describe(`${w}x900 light`, () => {
		test.use({ viewport: { width: w, height: 900 }, colorScheme: "light" });

		test(`${caseId("C3", 64 + index)} ${w}px에서 49자 공백 없는 제목이 한 줄로 말줄임되고 주소는 줄어들지 않음`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const before = await t.measure();
			const h1 = t.page.locator("main h1:visible");
			await h1.evaluate((e) => {
				e.textContent = "가".repeat(49);
			});
			await t.page.waitForTimeout(200);
			const m = await t.measure();
			t.ok(
				"가로 스크롤 없음",
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.near("h1 높이(한 줄)", m.h1s[0]?.rect.h, 38);
			t.near(
				"주소 폭이 원래와 같음",
				m.addr?.rect.w,
				before.addr?.rect.w ?? Number.NaN,
				0.5,
			);
			t.near(
				"주소 높이가 원래(한 줄)와 같음",
				m.addr?.rect.h,
				before.addr?.rect.h ?? Number.NaN,
				0.5,
			);
			t.ok(
				"주소 오른쪽 끝이 뷰포트 안",
				(m.addr?.rect.r ?? Number.POSITIVE_INFINITY) <= m.vw,
				m.addr?.rect.r,
				`≤ ${m.vw}`,
			);
		});
	});
}

// 헤더 고정 (2026-11-09 피드백 8번): 스크롤해도 위 0에 붙고 불투명하며 다이얼로그보다 낮음
for (const [index, viewport] of [MOBILE, DESKTOP].entries()) {
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${caseId("C3", 66 + index)} ${viewport.width}px에서 스크롤해도 헤더가 위 0에 붙어 있고 sticky, z-index 1, 불투명 배경을 가짐 (2026-11-09 피드백 8번)`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			await t.page.evaluate(() => window.scrollTo(0, 600));
			await t.page.waitForTimeout(250);
			const m = await t.page.evaluate(() => {
				const header = document.querySelector("header");
				if (!header) return null;
				const visible = [...header.children].find(
					(e) => getComputedStyle(e).display !== "none",
				);
				return {
					position: getComputedStyle(header).position,
					top: getComputedStyle(header).top,
					zIndex: getComputedStyle(header).zIndex,
					y: header.getBoundingClientRect().top,
					bg: visible
						? getComputedStyle(visible.firstElementChild ?? visible)
								.backgroundColor
						: null,
				};
			});
			if (!m) {
				t.fail("header 요소가 없음");
				return;
			}
			t.eq("position", m.position, "sticky");
			t.eq("top", m.top, "0px");
			t.eq("z-index", m.zIndex, "1");
			t.near("600 스크롤 뒤 헤더 위쪽", m.y, 0);
			t.ok(
				"헤더 배경이 투명이 아님",
				!!m.bg && !sameColor(m.bg, "rgba(0, 0, 0, 0)"),
				m.bg,
				"불투명",
			);
		});
	});
}
