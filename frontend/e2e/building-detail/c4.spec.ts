// S2 건물 상세 C4: 건물 정보 동 카드
// 기대값 출처: 설계 2절(상태표, 글자 크기, 주요 간격), 3절(문구), 4.5절(숨김 규칙), 7절(색), 12절 21, 22번, 캔버스 보드 B 데이터

import { ASIDE_X } from "../support/buildingDetail/asideX";
import { OK_IDS } from "../support/buildingDetail/buildingFixtures";
import { c4CardHeight } from "../support/buildingDetail/c4CardHeight";
import { c4CheckBaseMonth } from "../support/buildingDetail/c4CheckBaseMonth";
import { c4CheckCards } from "../support/buildingDetail/c4CheckCards";
import { c4DesktopGeometry } from "../support/buildingDetail/c4DesktopGeometry";
import { INFO, WIDE_LABELS } from "../support/buildingDetail/c4Info";
import {
	ASIDE_W,
	DESKTOP_LINKS_H,
	MOBILE_LINKS_H,
} from "../support/buildingDetail/c4Layout";
import { c4MobileGeometry } from "../support/buildingDetail/c4MobileGeometry";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import {
	DESKTOP,
	MOBILE,
	MOBILE_CARD,
	MOBILE_TITLE_HEIGHT,
} from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

// ---- 모바일 ----
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C4-01 모바일 건물 정보 섹션의 제목, 주소, padding, 의미 구조가 설계와 같음 (id 1)", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.measureInfo();
		t.ok(
			"건물 정보 섹션이 보임",
			m.found,
			m.found,
			"보이는 건물 정보 섹션이 있음",
		);
		t.eq("보이는 건물 정보 제목 개수", m.visibleInfoTitles, 1);
		t.eq("제목 문구", m.h2?.text, "건물 정보");
		t.ok(
			"section aria-labelledby가 제목 id를 가리킴",
			!!m.section?.labelledBy && m.section.labelledBy === m.h2?.id,
			m.section?.labelledBy,
			m.h2?.id ?? "",
		);
		t.eq("aria-labelledby가 가리키는 글자", m.labelledByText, "건물 정보");
		t.near("섹션 x", m.section?.rect.x, MOBILE_CARD.x);
		t.near(
			"섹션 y (헤더 아래 카드 border 1과 건물명 제목 블록 44)",
			m.section?.rect.y,
			(m.headerBottom ?? Number.NaN) + 1 + MOBILE_TITLE_HEIGHT,
		);
		t.near("섹션 w", m.section?.rect.w, MOBILE_CARD.width);
		t.eq(
			"섹션 padding 위20 좌우16 아래24",
			m.section?.pad,
			"20px 16px 24px 16px",
		);
		t.eq("섹션 border 없음", m.section?.bw, "0px");
		t.near("제목 x", m.h2?.rect.x, MOBILE_CARD.x + 16);
		t.near(
			"제목 y",
			m.h2?.rect.y,
			(m.headerBottom ?? Number.NaN) + 1 + MOBILE_TITLE_HEIGHT + 20,
		);
		t.near("제목 h", m.h2?.rect.h, 24);
		t.eq(
			"제목 글자 18/24 굵게",
			[m.h2?.fs, m.h2?.lh, m.h2?.fw],
			["18px", "24px", "700"],
		);
		t.ok(
			"주소가 제목 아래에 있음",
			!!m.address,
			m.address,
			"건물명이 있으므로 주소가 있음",
		);
		t.ok(
			"주소 문구",
			/마포구 망원동 12-3$/.test(m.address?.text ?? ""),
			m.address?.text,
			"마포구 망원동 12-3",
		);
		t.near("주소 x", m.address?.rect.x, MOBILE_CARD.x + 16);
		t.near(
			"주소 y (제목 아래 간격 2)",
			m.address?.rect.y,
			(m.h2?.rect.y ?? Number.NaN) + 24 + 2,
		);
		t.near("주소 h", m.address?.rect.h, 20);
		t.eq(
			"주소 글자 14/20 굵기 400",
			[m.address?.fs, m.address?.lh, m.address?.fw],
			["14px", "20px", "400"],
		);
		t.eq("모바일에서 aside가 보이지 않음", m.asideVisible, 0);
		t.eq("건물 정보 섹션 아래에 dl이 카드 수만큼 있음", m.cards?.length, 2);
	});
});
for (const [index, id] of OK_IDS.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
		test.use({ viewport: MOBILE, colorScheme: "light" });

		test(`${caseId("C4", 2 + index)} 모바일 id ${id}의 동 카드 순서, 항목 라벨과 값, 2열 grid 위치와 크기가 설계와 같음`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`);
			const m = await t.measureInfo();
			t.ok("건물 정보 섹션이 보임", m.found, m.found, "있음");
			const g = c4MobileGeometry(m, id, MOBILE_CARD.x, MOBILE_CARD.width);
			t.eq(`id ${id} 주소 부제 유무`, !!m.address, g.hasAddress);
			t.near(
				`id ${id} 섹션 h`,
				m.section?.rect.h,
				20 +
					g.headingH +
					12 +
					INFO[id].reduce(
						(sum, rows) => sum + c4CardHeight(rows, true) + 12,
						0,
					) +
					16 +
					MOBILE_LINKS_H +
					24,
			);
			c4CheckCards(t, m, id, g);
			c4CheckBaseMonth(t, m, id, g);
		});
	});
}
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${MOBILE.width}x${MOBILE.height} ${theme}`, () => {
		test.use({ viewport: MOBILE, colorScheme: theme });

		test(`${caseId("C4", 7 + themeIndex)} 모바일 건물 정보의 배경, 카드 border, 글자 색이 토큰과 같음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measureInfo();
			t.color(
				"섹션 배경 bg.layerDefault",
				m.section?.bg,
				t.tokens.layerDefault,
			);
			t.color("제목 fg.neutral", m.h2?.color, t.tokens.fgNeutral);
			t.color("주소 fg.neutralMuted", m.address?.color, t.tokens.fgMuted);
			for (const [i, c] of (m.cards ?? []).entries()) {
				t.color(
					`카드 ${i} border stroke.neutralWeak`,
					c.bc,
					t.tokens.strokeWeak,
				);
				t.color(
					`카드 ${i} 제목 fg.neutral`,
					c.title?.color,
					t.tokens.fgNeutral,
				);
				for (const it of c.items) {
					t.color(
						`카드 ${i} ${it.dt?.text} 라벨 fg.neutralMuted`,
						it.dt?.color,
						t.tokens.fgMuted,
					);
					t.color(
						`카드 ${i} ${it.dt?.text} 값 fg.neutral`,
						it.dd?.color,
						t.tokens.fgNeutral,
					);
				}
			}
			t.color("기준 월 fg.neutralMuted", m.base?.color, t.tokens.fgMuted);
		});
	});
}
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C4-09 id 5는 모든 동에서 사용승인 항목만 빠지고 나머지는 id 1과 같음 (모바일)", async ({
		t,
	}) => {
		await t.goto("/buildings/5");
		const m = await t.measureInfo();
		t.eq("동 카드 개수", m.cards?.length, 2);
		for (const [i, c] of (m.cards ?? []).entries()) {
			const labels = c.items.map((it) => it.dt?.text);
			t.ok(
				`카드 ${i}에 사용승인 항목이 없음`,
				!labels.includes("사용승인"),
				labels,
				"사용승인 없음",
			);
			t.eq(`카드 ${i} 첫 항목`, labels[0], "세대수");
			t.eq(`카드 ${i} 항목 개수`, labels.length, INFO[1][i].length - 1);
		}
		t.ok(
			"화면에 빈 사용승인 값(null, undefined, NaN)이 없음",
			!/null|undefined|NaN/.test(m.bodyText),
			m.bodyText.match(/null|undefined|NaN/)?.[0],
			"없음",
		);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C4-10 id 4는 세대수 0과 내진설계 빈 값이 숨겨지고 승강기 0은 없음으로 나옴 (모바일)", async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.measureInfo();
		const c = m.cards?.[0];
		const labels = c?.items.map((it) => it.dt?.text) ?? [];
		t.ok("세대수 항목 없음", !labels.includes("세대수"), labels, "세대수 없음");
		t.ok(
			"내진설계 항목 없음",
			!labels.includes("내진설계"),
			labels,
			"내진설계 없음",
		);
		t.ok(
			"0세대 문구가 없음",
			!/0세대/.test(m.bodyText),
			m.bodyText.match(/\d+세대/)?.[0],
			"없음",
		);
		t.eq(
			"승강기 값",
			c?.items.find((it) => it.dt?.text === "승강기")?.dd?.text,
			"없음",
		);
		t.eq("모바일 제목 아래 주소 부제 없음 (건물명이 없음)", m.address, null);
		t.eq("제목 문구", m.h2?.text, "건물 정보");
		t.ok(
			"화면에 null, undefined, NaN이 없음",
			!/null|undefined|NaN/.test(m.bodyText),
			m.bodyText.match(/null|undefined|NaN/)?.[0],
			"없음",
		);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C4-11 id 3은 동이 하나이고 내진설계 미적용과 연면적 612.0㎡가 나옴 (모바일)", async ({
		t,
	}) => {
		await t.goto("/buildings/3");
		const m = await t.measureInfo();
		t.eq("동 카드 개수", m.cards?.length, 1);
		const byLabel = (label: string) =>
			m.cards?.[0]?.items.find((it) => it.dt?.text === label)?.dd?.text;
		t.eq("내진설계", byLabel("내진설계"), "미적용");
		t.eq("연면적", byLabel("연면적"), "612.0㎡");
		t.eq("승강기", byLabel("승강기"), "없음");
		t.eq("주차 대수", byLabel("주차 대수"), "자주식 옥외 4대");
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test("C4-12 모바일에서 모든 건물의 id가 중복되지 않고 건물 정보 제목 id가 모바일용 접미사를 가짐", async ({
		t,
	}) => {
		for (const id of OK_IDS) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.measureInfo();
			const md = await t.measure();
			t.eq(`id ${id} 중복 id`, md.dupIds, []);
			t.ok(
				`id ${id} 모바일 제목 id 접미사`,
				/-mobile$/.test(m.h2?.id ?? ""),
				m.h2?.id,
				"-mobile로 끝남",
			);
		}
	});
});

// ---- 태블릿 ----
test.describe(`768x900 light`, () => {
	test.use({ viewport: { width: 768, height: 900 }, colorScheme: "light" });

	test("C4-13 768px 태블릿에서 모바일 레이아웃의 건물 정보가 720 컬럼 안에서 같은 구조로 나옴", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.measureInfo();
		t.ok("건물 정보 섹션이 보임", m.found, m.found, "있음");
		t.near("섹션 x (컬럼 가운데 720)", m.section?.rect.x, 24);
		t.near("섹션 w", m.section?.rect.w, 720);
		t.eq("섹션 border 없음 (설계자 결정 17)", m.section?.bw, "0px");
		t.color("섹션 배경 bg.layerDefault", m.section?.bg, t.tokens.layerDefault);
		t.eq("태블릿에서 aside가 보이지 않음", m.asideVisible, 0);
		t.near("제목 x", m.h2?.rect.x, 24 + 16);
		const g = c4MobileGeometry(m, 1, 24, 720);
		c4CheckCards(t, m, 1, g);
		c4CheckBaseMonth(t, m, 1, g);
		t.ok(
			"가로 스크롤 없음",
			m.doc.scrollW <= m.doc.vw,
			m.doc.scrollW,
			`≤ ${m.doc.vw}`,
		);
	});
});

// ---- 320 ----
test.describe(`320x700 light`, () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C4-14 320px에서 모든 건물의 건물 정보가 가로 스크롤 없이 카드 안에 들어옴", async ({
		t,
	}) => {
		for (const id of OK_IDS) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.measureInfo();
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.doc.scrollW <= m.doc.vw,
				m.doc.scrollW,
				`≤ ${m.doc.vw}`,
			);
			const g = c4MobileGeometry(m, id, MOBILE_CARD.x, 320 - 2 * MOBILE_CARD.x);
			t.eq(`id ${id} 동 카드 개수`, m.cards?.length, INFO[id].length);
			for (const [i, c] of (m.cards ?? []).entries()) {
				t.near(`id ${id} 카드 ${i} x`, c.rect.x, g.cardX);
				t.near(`id ${id} 카드 ${i} w`, c.rect.w, g.cardW);
				for (const it of c.items) {
					t.ok(
						`id ${id} 카드 ${i} ${it.dt?.text} 값이 카드 안에 들어옴`,
						(it.dd?.textRight ?? Number.POSITIVE_INFINITY) <=
							c.rect.r - 16 + 0.5,
						it.dd?.textRight,
						`≤ ${c.rect.r - 16}`,
					);
					t.near(
						`id ${id} 카드 ${i} ${it.dt?.text} 칸 폭`,
						it.dt?.rect.w,
						WIDE_LABELS.includes(it.dt?.text ?? "")
							? g.cardW - 34
							: (g.cardW - 34 - 16) / 2,
					);
				}
			}
			c4CheckBaseMonth(t, m, id, g);
		}
	});
});

// ---- 데스크톱 ----
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C4-15 데스크톱 aside가 오른쪽 380 열에 하나만 있고 건물 정보 카드의 border와 padding이 설계와 같음", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const m = await t.measureInfo();
		t.ok("건물 정보 섹션이 보임", m.found, m.found, "있음");
		t.eq("보이는 건물 정보 제목 개수", m.visibleInfoTitles, 1);
		t.eq("문서 전체 aside 개수", m.asideAll, 1);
		t.eq("보이는 aside 개수", m.asideVisible, 1);
		const g = c4DesktopGeometry(m);
		t.near("섹션 x (aside 열)", m.section?.rect.x, ASIDE_X);
		t.near("섹션 w", m.section?.rect.w, ASIDE_W);
		t.near(
			"섹션 y (헤더 + 28 + 제목 줄 44 + 간격 24)",
			m.section?.rect.y,
			g.secY,
		);
		t.eq("섹션 border 1px", m.section?.bw, "1px");
		t.eq("섹션 둥글기 r5", m.section?.radius, "20px");
		t.eq("섹션 padding 24", m.section?.pad, "24px 24px 24px 24px");
		t.ok(
			"section aria-labelledby가 제목 id를 가리킴",
			!!m.section?.labelledBy && m.section.labelledBy === m.h2?.id,
			m.section?.labelledBy,
			m.h2?.id ?? "",
		);
		t.eq("aria-labelledby가 가리키는 글자", m.labelledByText, "건물 정보");
		t.ok(
			"제목 id가 데스크톱용 접미사를 가짐",
			/-desktop$/.test(m.h2?.id ?? ""),
			m.h2?.id,
			"-desktop으로 끝남",
		);
		t.near("제목 x", m.h2?.rect.x, g.cardX);
		t.near("제목 y", m.h2?.rect.y, g.h2Y);
		t.eq(
			"제목 글자 18/24 굵게",
			[m.h2?.fs, m.h2?.lh, m.h2?.fw],
			["18px", "24px", "700"],
		);
		t.eq("데스크톱 aside 제목 아래에 주소가 없음", m.address, null);
		t.ok(
			"id 1 섹션 안에 주소 글자가 없음",
			!/망원동 12-3/.test(m.sectionText ?? ""),
			"주소가 들어 있음",
			"없음",
		);
		t.near(
			"섹션 h",
			m.section?.rect.h,
			2 +
				48 +
				24 +
				INFO[1].reduce((sum, rows) => sum + c4CardHeight(rows, true), 0) +
				16 +
				14 * 3 +
				DESKTOP_LINKS_H,
		);
	});
});
for (const [index, id] of OK_IDS.entries()) {
	test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
		test.use({ viewport: DESKTOP, colorScheme: "light" });

		test(`${caseId("C4", 16 + index)} 데스크톱 id ${id}의 aside 동 카드 순서, 항목 라벨과 값, 2열 grid 위치와 크기가 설계와 같음`, async ({
			t,
		}) => {
			await t.goto(`/buildings/${id}`);
			const m = await t.measureInfo();
			t.ok("건물 정보 섹션이 보임", m.found, m.found, "있음");
			const g = c4DesktopGeometry(m);
			t.eq(`id ${id} 주소 부제 없음`, m.address, null);
			t.eq(
				`id ${id} 동 제목 글자 15/22`,
				(m.cards ?? []).map((c) => [c.title?.fs, c.title?.lh]),
				(m.cards ?? []).map(() => ["15px", "22px"]),
			);
			c4CheckCards(t, m, id, g);
			c4CheckBaseMonth(t, m, id, g);
		});
	});
}
for (const [themeIndex, theme] of THEMES.entries()) {
	test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
		test.use({ viewport: DESKTOP, colorScheme: theme });

		test(`${caseId("C4", 21 + themeIndex)} 데스크톱 aside 건물 정보의 배경, border, 카드 border, 글자 색이 토큰과 같음 (${theme})`, async ({
			t,
		}) => {
			await t.goto("/buildings/1");
			const m = await t.measureInfo();
			t.color(
				"섹션 배경 bg.layerDefault",
				m.section?.bg,
				t.tokens.layerDefault,
			);
			t.color(
				"섹션 border stroke.neutralMuted",
				m.section?.bc,
				t.tokens.strokeMuted,
			);
			t.color("제목 fg.neutral", m.h2?.color, t.tokens.fgNeutral);
			for (const [i, c] of (m.cards ?? []).entries()) {
				t.color(
					`카드 ${i} border stroke.neutralWeak`,
					c.bc,
					t.tokens.strokeWeak,
				);
				t.color(
					`카드 ${i} 제목 fg.neutral`,
					c.title?.color,
					t.tokens.fgNeutral,
				);
				for (const it of c.items) {
					t.color(
						`카드 ${i} ${it.dt?.text} 라벨 fg.neutralMuted`,
						it.dt?.color,
						t.tokens.fgMuted,
					);
					t.color(
						`카드 ${i} ${it.dt?.text} 값 fg.neutral`,
						it.dd?.color,
						t.tokens.fgNeutral,
					);
				}
			}
			t.color("기준 월 fg.neutralMuted", m.base?.color, t.tokens.fgMuted);
		});
	});
}
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C4-23 id 5는 데스크톱 aside에서도 사용승인 항목만 빠짐", async ({
		t,
	}) => {
		await t.goto("/buildings/5");
		const m = await t.measureInfo();
		for (const [i, c] of (m.cards ?? []).entries()) {
			const labels = c.items.map((it) => it.dt?.text);
			t.ok(
				`카드 ${i}에 사용승인 항목이 없음`,
				!labels.includes("사용승인"),
				labels,
				"없음",
			);
			t.eq(`카드 ${i} 첫 항목`, labels[0], "세대수");
		}
		t.ok(
			"화면에 null, undefined, NaN이 없음",
			!/null|undefined|NaN/.test(m.bodyText),
			m.bodyText.match(/null|undefined|NaN/)?.[0],
			"없음",
		);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C4-24 id 4는 데스크톱 aside에서 세대수와 내진설계 항목이 숨겨지고 제목 줄은 주소 하나뿐임", async ({
		t,
	}) => {
		await t.goto("/buildings/4");
		const m = await t.measureInfo();
		const labels = m.cards?.[0]?.items.map((it) => it.dt?.text) ?? [];
		t.ok("세대수 항목 없음", !labels.includes("세대수"), labels, "없음");
		t.ok("내진설계 항목 없음", !labels.includes("내진설계"), labels, "없음");
		t.ok(
			"0세대 문구가 없음",
			!/0세대/.test(m.bodyText),
			m.bodyText.match(/\d+세대/)?.[0],
			"없음",
		);
		t.eq("aside 안 주소 없음", m.address, null);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C4-25 스크롤하면 aside가 위 24에 붙어 따라오고 aside 요소는 sticky와 내부 스크롤 값을 가짐", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const info = await t.page.evaluate(() => {
			const a = document.querySelector("aside");
			if (!a) return null;
			const c = getComputedStyle(a);
			return {
				position: c.position,
				top: c.top,
				maxHeight: c.maxHeight,
				overflowY: c.overflowY,
				x: a.getBoundingClientRect().x,
				w: a.getBoundingClientRect().width,
				vh: window.innerHeight,
			};
		});
		if (!info) {
			t.fail("aside 요소가 없음");
			return;
		}
		t.eq("position", info.position, "sticky");
		t.eq("top (x6 = 24)", info.top, "24px");
		t.eq("max-height (100dvh - 48)", info.maxHeight, `${info.vh - 48}px`);
		t.eq("overflow-y", info.overflowY, "auto");
		t.near("aside x", info.x, ASIDE_X);
		t.near("aside w", info.w, ASIDE_W);
		// 본문 열이 aside보다 길 때만 따라올 수 있으므로 본문 열 첫 셀에 임시로 높이를 줌 (코드 변경 없음, DOM 값만 바꿈)
		await t.page.evaluate(() => {
			const cell = document.querySelector("aside")?.previousElementSibling;
			if (cell instanceof HTMLElement) cell.style.minHeight = "2400px";
		});
		await t.page.evaluate(() => window.scrollTo(0, 700));
		await t.page.waitForTimeout(250);
		const top = await t.page.evaluate(
			() => document.querySelector("aside")?.getBoundingClientRect().top,
		);
		t.near("700 스크롤 뒤 aside 위쪽이 24에 붙음", top, 24);
		await t.page.evaluate(() => window.scrollTo(0, 0));
		await t.page.waitForTimeout(250);
		const top0 = await t.page.evaluate(
			() => document.querySelector("aside")?.getBoundingClientRect().top,
		);
		const m = await t.measureInfo();
		t.near("맨 위에서는 원래 위치", top0, c4DesktopGeometry(m).asideTop);
	});
});
test.describe(`1279x900 light`, () => {
	test.use({ viewport: { width: 1279, height: 900 }, colorScheme: "light" });

	test("C4-26 1279px와 1280px 사이에서 건물 정보가 모바일에서 데스크톱 aside로 한 번에 바뀜", async ({
		t,
	}) => {
		await t.goto("/buildings/1");
		const step = async (label: string, w: number, desktop: boolean) => {
			await t.page.setViewportSize({ width: w, height: 900 });
			await t.page.waitForTimeout(250);
			const m = await t.measureInfo();
			t.eq(`${label} 보이는 건물 정보 제목 개수`, m.visibleInfoTitles, 1);
			t.eq(`${label} 보이는 aside 개수`, m.asideVisible, desktop ? 1 : 0);
			t.eq(
				`${label} 제목 id 접미사`,
				(m.h2?.id ?? "").split("-").pop(),
				desktop ? "desktop" : "mobile",
			);
			t.eq(`${label} 동 카드 개수`, m.cards?.length, 2);
		};
		await step("1279", 1279, false);
		await step("1280", 1280, true);
		await step("다시 1279", 1279, false);
	});
});
test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test("C4-27 데스크톱에서 모든 건물의 id가 중복되지 않고 aside가 하나뿐임", async ({
		t,
	}) => {
		for (const id of OK_IDS) {
			await t.goto(`/buildings/${id}`, 400);
			const md = await t.measure();
			const m = await t.measureInfo();
			t.eq(`id ${id} 중복 id`, md.dupIds, []);
			t.eq(`id ${id} 문서 전체 aside 개수`, m.asideAll, 1);
		}
	});
});
test.describe(`1280x900 light`, () => {
	test.use({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });

	test("C4-28 1280px에서 모든 건물의 건물 정보가 가로 스크롤 없이 나옴", async ({
		t,
	}) => {
		for (const id of OK_IDS) {
			await t.goto(`/buildings/${id}`, 400);
			const m = await t.measureInfo();
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.doc.scrollW <= m.doc.vw,
				m.doc.scrollW,
				`≤ ${m.doc.vw}`,
			);
		}
	});
});
