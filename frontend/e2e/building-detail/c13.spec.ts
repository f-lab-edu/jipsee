// S2 건물 상세 C13: 질문하기 버튼, 카드, 하단 바
// 기대값: 설계 2절(로그인 표), 3절(문구), 6절(반응형), 7절(색), 12절 20번(이동 경로)과 캔버스 보드 S2Mobile/Desktop(Dark) Default
// 로그인 상태는 앱의 sessionMock이 정함. 기본 실행은 로그아웃 케이스만, TC_SESSION=in 이면 로그인 케이스만 실행함(sessionMock을 { provider: "GOOGLE" }로 바꾼 상태에서만 의미가 있음)
// 케이스 번호는 모드와 상관없이 올려서 id가 실행 방식에 따라 바뀌지 않게 하고, 실행하지 않는 모드는 skip함

import { ASIDE_X } from "../support/buildingDetail/asideX";
import { c13CheckAskInner } from "../support/buildingDetail/c13CheckAskInner";
import {
	ASK_ASIDE_W,
	ASK_GUIDE,
	ASK_IDS,
	ASK_TEXT,
	ASK_TOKENS,
	BAR_GEOM,
	BAR_H,
	CARD_GEOM,
	CARD_H,
} from "../support/buildingDetail/c13Fixtures";
import { c13MeasureAsk } from "../support/buildingDetail/c13MeasureAsk";
import { c13MeasureFooterHit } from "../support/buildingDetail/c13MeasureFooterHit";
import { shadowAlpha } from "../support/buildingDetail/c13ShadowAlpha";
import type { T } from "../support/buildingDetail/makeT";
import type { Theme } from "../support/buildingDetail/tokens";
import { caseId } from "../support/caseId";
import { test } from "../support/test";
import { DESKTOP, MOBILE } from "../support/viewports";

const SESSION_IN = process.env.TC_SESSION === "in";

type Mode = "out" | "in";

// 모드가 현재 실행 방식과 다르면 skip함
function skipUnlessMode(mode: Mode) {
	test.skip(
		(mode === "in") !== SESSION_IN,
		"로그인 상태는 TC_SESSION=in 으로만 실행함",
	);
}

const THEMES: Theme[] = ["light", "dark"];
const MODES: Mode[] = ["out", "in"];

const askMeasure = (t: T) => t.page.evaluate(c13MeasureAsk);
async function scrollAsk(t: T, ratio: number) {
	await t.page.evaluate(
		(r) =>
			window.scrollTo(
				0,
				(document.documentElement.scrollHeight - window.innerHeight) * r,
			),
		ratio,
	);
	await t.page.waitForTimeout(250);
	return askMeasure(t);
}

// ---- 모바일 바 ----
for (const [modeIndex, mode] of MODES.entries()) {
	const lbl = mode === "out" ? "로그아웃" : "로그인";
	test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
		test.use({ viewport: MOBILE, colorScheme: "light" });

		test(`${caseId("C13", 1 + 3 * modeIndex)} 모바일(${lbl})에서 id 1부터 5 모두 질문하기 영역이 바 하나이고 aside와 카드는 보이지 않음`, async ({
			t,
		}) => {
			skipUnlessMode(mode);
			for (const id of ASK_IDS) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await askMeasure(t);
				t.eq(`id ${id} 보이는 질문하기 영역 개수`, m.visibleCount, 1);
				t.eq(`id ${id} 보이는 질문하기 링크 개수`, m.visibleLinks, 1);
				t.eq(`id ${id} 보이는 aside 개수 (카드 없음)`, m.aside ?? null, null);
				t.eq(`id ${id} 바는 aside 밖`, m.sec?.inAside, false);
				t.eq(`id ${id} aria-label`, m.sec?.label, "질문하기");
				t.eq(
					`id ${id} DOM의 질문하기 영역은 둘이고 하나는 숨겨짐`,
					[m.sectionsInDom, m.hiddenSections],
					[2, 1],
				);
			}
		});
	});
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${MOBILE.width}x${MOBILE.height} ${theme}`, () => {
			test.use({ viewport: MOBILE, colorScheme: theme });

			test(`${caseId("C13", 2 + 3 * modeIndex + themeIndex)} 모바일(${lbl}) 바의 위치, 크기, padding, border, 배경, 그림자가 캔버스와 같음 (${theme})`, async ({
				t,
			}) => {
				skipUnlessMode(mode);
				await t.goto("/buildings/1", 500);
				const m = await scrollAsk(t, 0);
				const s = m.sec;
				t.ok("바가 있음", !!s, s, "있음");
				if (!s) return;
				t.near("x", s.x, 0);
				t.near("w", s.w, 390);
				t.near(`h (${lbl})`, s.h, BAR_H[mode]);
				t.near("맨 위에서 바 아래 끝이 뷰포트 아래에 붙음", s.b, m.vh);
				t.eq("position", s.pos, "sticky");
				t.eq("bottom", s.bottomCss, "0px");
				t.eq("padding 위12 좌우16 아래16", s.pad, "12px 16px 16px 16px");
				t.eq("border 위쪽만 1px", s.bw, "1px 0px 0px 0px");
				t.color(
					"위쪽 border 색 stroke.neutralMuted",
					s.bc,
					t.tokens.strokeMuted,
				);
				t.color("배경 bg.layerFloating", s.bg, ASK_TOKENS[theme].floating);
				t.eq("radius 없음", s.radius, "0px");
				t.eq("안쪽 세로 배치와 간격 8", [s.dir, s.gap], ["column", "8px"]);
				t.ok(
					"그림자는 위쪽으로 6 번지고 흐림 20",
					/0px -6px 20px 0px/.test(s.shadow),
					s.shadow,
					"0px -6px 20px 0px",
				);
				t.near(
					"그림자 투명도",
					shadowAlpha(s.shadow),
					ASK_TOKENS[theme].shadowAlpha,
					0.005,
				);
				c13CheckAskInner(t, m, "바", {
					...BAR_GEOM,
					btnY: s.y + 13,
					noGuide: mode === "in",
				});
			});
		});
	}
}

test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-07 모바일 바는 스크롤해도 뷰포트 아래에 붙고 맨 끝에서 푸터 링크를 가리지 않음 (id 1)`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		await t.goto("/buildings/1", 500);
		for (const [name, r] of [
			["맨 위", 0],
			["가운데", 0.5],
			["맨 끝", 1],
		] as const) {
			const m = await scrollAsk(t, r);
			t.near(`${name}에서 바 아래 끝`, m.sec?.b, m.vh);
			t.near(`${name}에서 바 높이`, m.sec?.h, BAR_H.out);
		}
		const m = await scrollAsk(t, 1);
		t.ok(
			"맨 끝까지 스크롤됨",
			m.sy > 0 && Math.abs(m.sy + m.vh - m.scrollH) <= 1,
			[m.sy, m.vh, m.scrollH],
			"sy + vh = scrollH",
		);
		t.near(
			"푸터 아래 끝이 바 위쪽에 닿음 (캔버스에서 바는 푸터 아래)",
			m.footer?.b,
			m.sec?.y,
			1,
		);
		const hits = await t.page.evaluate(c13MeasureFooterHit);
		t.eq("푸터 링크 3개", hits.length, 3);
		for (const h of hits) {
			t.ok(
				`푸터 링크 "${h.text}"가 바보다 위에 있음`,
				h.b <= (m.sec?.y ?? Number.NaN) + 0.5,
				h.b,
				`≤ ${m.sec?.y}`,
			);
			t.ok(
				`푸터 링크 "${h.text}" 가운데를 누를 수 있음`,
				h.hit,
				h.hit,
				"그 링크가 가장 위",
			);
		}
	});
});
test.describe(`390x1800 light`, () => {
	test.use({ viewport: { width: 390, height: 1800 }, colorScheme: "light" });

	test(`C13-08 모바일에서 본문이 짧으면 바가 푸터 아래에서 뷰포트 아래에 붙고 세로 스크롤이 없음 (id 4, 390x1800)`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		await t.goto("/buildings/4", 500);
		const m = await askMeasure(t);
		t.ok(
			"세로 스크롤 없음",
			m.scrollH <= m.vh + 1,
			m.scrollH,
			`문서 높이 ≤ ${m.vh}`,
		);
		t.near("바 아래 끝이 뷰포트 아래", m.sec?.b, m.vh);
		t.near("푸터 아래 끝이 바 위쪽에 닿음", m.footer?.b, m.sec?.y, 1);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-09 모든 상태(id 1에서 5와 월세)에서 모바일 바 높이가 같고 맨 끝에서 푸터 아래에 닿음`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		for (const u of [
			"/buildings/1",
			"/buildings/2",
			"/buildings/3",
			"/buildings/4",
			"/buildings/5",
			"/buildings/1?type=wolse",
			"/buildings/3?type=wolse",
		]) {
			await t.goto(u, 400);
			const m = await scrollAsk(t, 1);
			t.near(`${u} 바 높이`, m.sec?.h, BAR_H.out);
			t.near(`${u} 바 아래 끝`, m.sec?.b, m.vh);
			t.near(`${u} 푸터 아래 끝 = 바 위쪽`, m.footer?.b, m.sec?.y, 1);
		}
	});
});

// ---- 데스크톱 카드 ----
for (const [modeIndex, mode] of MODES.entries()) {
	const lbl = mode === "out" ? "로그아웃" : "로그인";
	test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
		test.use({ viewport: DESKTOP, colorScheme: "light" });

		test(`${caseId("C13", 10 + 3 * modeIndex)} 데스크톱(${lbl})에서 id 1부터 5 모두 질문하기 영역이 aside 맨 위 카드 하나이고 바는 보이지 않음`, async ({
			t,
		}) => {
			skipUnlessMode(mode);
			for (const id of ASK_IDS) {
				await t.goto(`/buildings/${id}`, 400);
				const m = await askMeasure(t);
				t.eq(`id ${id} 보이는 질문하기 영역 개수`, m.visibleCount, 1);
				t.eq(`id ${id} 보이는 질문하기 링크 개수`, m.visibleLinks, 1);
				t.eq(
					`id ${id} 카드는 aside 안 세로 묶음의 첫 자식`,
					[m.sec?.inAside, m.sec?.firstInAside],
					[true, true],
				);
				t.eq(`id ${id} aria-label`, m.sec?.label, "질문하기");
				t.eq(
					`id ${id} DOM의 질문하기 영역은 둘이고 하나는 숨겨짐`,
					[m.sectionsInDom, m.hiddenSections],
					[2, 1],
				);
			}
		});
	});
	for (const [themeIndex, theme] of THEMES.entries()) {
		test.describe(`${DESKTOP.width}x${DESKTOP.height} ${theme}`, () => {
			test.use({ viewport: DESKTOP, colorScheme: theme });

			test(`${caseId("C13", 11 + 3 * modeIndex + themeIndex)} 데스크톱(${lbl}) 카드의 위치, 크기, padding, border, 배경이 캔버스와 같고 건물 정보가 16 아래에 이어짐 (${theme})`, async ({
				t,
			}) => {
				skipUnlessMode(mode);
				for (const id of ASK_IDS) {
					await t.goto(`/buildings/${id}`, 400);
					const m = await scrollAsk(t, 0);
					const s = m.sec;
					t.ok(`id ${id} 카드가 있음`, !!s, s, "있음");
					if (!s) continue;
					t.near(`id ${id} x (aside 열)`, s.x, ASIDE_X);
					t.near(`id ${id} w`, s.w, ASK_ASIDE_W);
					t.near(`id ${id} y (aside 위, 캔버스 161)`, s.y, 161);
					t.near(`id ${id} y가 aside 위쪽과 같음`, s.y, m.aside?.y);
					t.near(`id ${id} y가 거래 이력 섹션 위쪽과 같음`, s.y, m.dealHist?.y);
					t.near(`id ${id} h (${lbl}, 캔버스 + border 2)`, s.h, CARD_H[mode]);
					t.eq(`id ${id} position이 sticky가 아님`, s.pos, "static");
					t.eq(`id ${id} padding 24`, s.pad, "24px 24px 24px 24px");
					t.eq(`id ${id} border 1px 네 면`, s.bw, "1px 1px 1px 1px");
					t.color(
						`id ${id} border 색 stroke.neutralMuted`,
						s.bc,
						t.tokens.strokeMuted,
					);
					t.eq(`id ${id} radius 20`, s.radius, "20px");
					t.color(
						`id ${id} 배경 bg.layerFloating`,
						s.bg,
						ASK_TOKENS[theme].floating,
					);
					t.eq(
						`id ${id} 안쪽 세로 배치와 간격 10`,
						[s.dir, s.gap],
						["column", "10px"],
					);
					t.eq(`id ${id} 그림자 없음`, s.shadow, "none");
					t.near(
						`id ${id} 건물 정보 y = 카드 아래 + 16 (캔버스 309 + border 2)`,
						m.info?.y,
						s.b + 16,
					);
					t.near(
						`id ${id} 건물 정보 y 절대값 (캔버스 309 + 카드 border 2)`,
						m.info?.y,
						311 - (mode === "in" ? 28 : 0),
					);
				}
				await t.goto("/buildings/1", 400);
				const m1 = await askMeasure(t);
				c13CheckAskInner(t, m1, "카드", {
					...CARD_GEOM,
					btnY: (m1.sec?.y ?? Number.NaN) + 25,
					noGuide: mode === "in",
				});
			});
		});
	}
}

test.describe(`${DESKTOP.width}x${DESKTOP.height} light`, () => {
	test.use({ viewport: DESKTOP, colorScheme: "light" });

	test(`C13-16 데스크톱 카드는 스크롤하면 aside와 함께 위 24에 붙어 따라오고 건물 정보가 aside 안에서 끝까지 보임 (id 1)`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		await t.goto("/buildings/1", 500);
		const m0 = await askMeasure(t);
		// 카드 134 + 간격 16 + 건물 정보가 뷰포트 900 - 48보다 길어 aside 안에서 스크롤됨
		t.eq("aside overflow-y", m0.asideScroll?.oy, "auto");
		t.ok(
			"aside 내용이 aside보다 김",
			(m0.asideScroll?.sh ?? 0) > (m0.asideScroll?.ch ?? 0),
			[m0.asideScroll?.sh, m0.asideScroll?.ch],
			"scrollHeight > clientHeight",
		);
		t.near(
			"aside clientHeight (100dvh - 48 - border 0)",
			m0.asideScroll?.ch,
			m0.vh - 48,
			1,
		);
		await t.page.evaluate(() => {
			const prev = document.querySelector("aside")?.previousElementSibling;
			if (prev instanceof HTMLElement) prev.style.minHeight = "2400px";
		});
		await t.page.evaluate(() => window.scrollTo(0, 700));
		await t.page.waitForTimeout(250);
		const m1 = await askMeasure(t);
		t.near("700 스크롤 뒤 aside 위쪽이 24에 붙음", m1.aside?.y, 24);
		t.near("700 스크롤 뒤 카드 위쪽도 24", m1.sec?.y, 24);
		await t.page.evaluate(() => {
			const a = document.querySelector("aside");
			if (a) a.scrollTop = a.scrollHeight;
		});
		await t.page.waitForTimeout(200);
		const m2 = await askMeasure(t);
		t.ok(
			"aside를 끝까지 스크롤하면 건물 정보 아래 끝이 aside 안에 들어옴",
			(m2.info?.b ?? Number.NaN) <= (m2.aside?.b ?? Number.NaN) + 1,
			[m2.info?.b, m2.aside?.b],
			"info.b ≤ aside.b",
		);
	});
});

test.describe(`1279x900 light`, () => {
	test.use({ viewport: { width: 1279, height: 900 }, colorScheme: "light" });

	test(`C13-17 1279px에서는 바만, 1280px에서는 카드만 보이고 둘이 한 번에 바뀜`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		await t.goto("/buildings/1", 400);
		for (const [w, desktop] of [
			[1279, false],
			[1280, true],
			[1279, false],
		] as const) {
			await t.page.setViewportSize({ width: w, height: 900 });
			await t.page.waitForTimeout(250);
			const m = await askMeasure(t);
			t.eq(`${w}px 보이는 질문하기 영역 개수`, m.visibleCount, 1);
			t.eq(`${w}px 보이는 aside 개수`, m.aside ? 1 : 0, desktop ? 1 : 0);
			t.eq(`${w}px 질문하기 영역이 aside 안`, m.sec?.inAside, desktop);
			t.near(
				`${w}px 질문하기 영역 h`,
				m.sec?.h,
				desktop ? CARD_H.out : BAR_H.out,
			);
			t.ok(
				`${w}px 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`≤ ${m.vw}`,
			);
		}
	});
});

// ---- 이동 경로와 문구 ----
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-18 로그아웃에서는 모바일 바와 데스크톱 카드의 링크가 /login이고 누르면 /login으로 이동함 (id 1부터 5)`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		for (const id of ASK_IDS) {
			await t.goto(`/buildings/${id}`, 300);
			t.eq(`모바일 id ${id} href`, (await askMeasure(t)).btn?.href, "/login");
		}
		await t.page.setViewportSize({ width: 1440, height: 900 });
		for (const id of ASK_IDS) {
			await t.goto(`/buildings/${id}`, 300);
			t.eq(`데스크톱 id ${id} href`, (await askMeasure(t)).btn?.href, "/login");
		}
		// 이동 확인 (라우트가 아직 없어 404 화면이 나오는 것이 정상임)
		await t.goto("/buildings/1", 300);
		await t.page
			.locator("a", { hasText: ASK_TEXT })
			.locator("visible=true")
			.first()
			.click();
		await t.page.waitForURL(/\/login$/, { timeout: 15000 });
		t.eq(
			"누른 뒤 경로",
			new URL(t.page.url()).pathname + new URL(t.page.url()).search,
			"/login",
		);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-19 로그인에서는 모바일 바와 데스크톱 카드의 링크가 /chat?buildingId={id}이고 누르면 그 주소로 이동함 (id 1부터 5)`, async ({
		t,
	}) => {
		skipUnlessMode("in");
		for (const id of ASK_IDS) {
			await t.goto(`/buildings/${id}`, 300);
			t.eq(
				`모바일 id ${id} href`,
				(await askMeasure(t)).btn?.href,
				`/chat?buildingId=${id}`,
			);
		}
		await t.page.setViewportSize({ width: 1440, height: 900 });
		for (const id of ASK_IDS) {
			await t.goto(`/buildings/${id}`, 300);
			const m = await askMeasure(t);
			t.eq(`데스크톱 id ${id} href`, m.btn?.href, `/chat?buildingId=${id}`);
			t.eq(
				`데스크톱 id ${id} 헤더 버튼이 내 정보 (세션이 로그인 상태인지 확인)`,
				m.myInfoVisible,
				1,
			);
		}
		await t.goto("/buildings/2", 300);
		await t.page
			.locator("a", { hasText: ASK_TEXT })
			.locator("visible=true")
			.first()
			.click();
		await t.page.waitForURL(/\/chat\?buildingId=2$/, { timeout: 15000 });
		t.eq(
			"누른 뒤 경로",
			new URL(t.page.url()).pathname + new URL(t.page.url()).search,
			"/chat?buildingId=2",
		);
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-20 로그인에서는 안내 한 줄이 어디에도 없음 (모바일, 데스크톱)`, async ({
		t,
	}) => {
		skipUnlessMode("in");
		for (const [w, h] of [
			[390, 844],
			[1440, 900],
		]) {
			await t.page.setViewportSize({ width: w, height: h });
			await t.goto("/buildings/1", 300);
			const m = await askMeasure(t);
			t.eq(`${w}px 안내 한 줄`, m.guide, null);
			t.ok(
				`${w}px 본문 전체에 안내 문구가 없음`,
				!(await t.page.evaluate(() => document.body.innerText)).includes(
					ASK_GUIDE,
				),
				"있음",
				"없음",
			);
		}
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-21 로그아웃에서는 안내 한 줄이 보이는 영역마다 하나씩이고 문구가 설계 3절과 같음`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		for (const [w, h] of [
			[390, 844],
			[1440, 900],
		]) {
			await t.page.setViewportSize({ width: w, height: h });
			await t.goto("/buildings/1", 300);
			const m = await askMeasure(t);
			t.eq(`${w}px 보이는 안내 문구 개수`, m.guideCount, 1);
			t.eq(`${w}px 안내 문구`, m.guide?.text, ASK_GUIDE);
		}
	});
});

// ---- 좁은 화면과 id ----
test.describe(`320x700 light`, () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test(`C13-22 320px에서 바와 버튼과 안내가 가로 스크롤 없이 폭 안에 들어옴`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		for (const id of ASK_IDS) {
			await t.goto(`/buildings/${id}`, 300);
			const m = await askMeasure(t);
			const nan = Number.NaN;
			t.ok(
				`id ${id} 가로 스크롤 없음`,
				m.scrollW <= m.vw,
				m.scrollW,
				`≤ ${m.vw}`,
			);
			t.near(`id ${id} 바 w`, m.sec?.w, 320, 0.5);
			t.near(`id ${id} 버튼 w (320 - 32)`, m.btn?.w, 288, 0.5);
			t.ok(
				`id ${id} 버튼 문구가 버튼 안`,
				(m.btn?.tr.x ?? nan) >= (m.btnIcon?.x ?? nan) - 0.5 &&
					(m.btn?.tr.r ?? nan) <= (m.btn?.r ?? nan),
				[m.btn?.tr.x, m.btn?.tr.r],
				"버튼 안",
			);
			t.near(`id ${id} 버튼 h`, m.btn?.h, 52);
			t.ok(
				`id ${id} 안내가 한 줄(h 18) 안`,
				(m.guide?.h ?? nan) <= 18.5 &&
					(m.guide?.icon.x ?? nan) >= (m.guide?.x ?? nan) - 0.5 &&
					(m.guide?.tr.r ?? nan) <= (m.guide?.r ?? nan) + 0.5,
				[m.guide?.h, m.guide?.icon.x, m.guide?.tr.r],
				"한 줄이고 폭 안",
			);
			t.near(`id ${id} 바 h`, m.sec?.h, BAR_H.out);
		}
	});
});
test.describe(`${MOBILE.width}x${MOBILE.height} light`, () => {
	test.use({ viewport: MOBILE, colorScheme: "light" });

	test(`C13-23 id가 문서에서 중복되지 않음 (모바일, 데스크톱, id 1부터 5)`, async ({
		t,
	}) => {
		skipUnlessMode("out");
		for (const [w, h] of [
			[390, 844],
			[1440, 900],
		]) {
			await t.page.setViewportSize({ width: w, height: h });
			for (const id of ASK_IDS) {
				await t.goto(`/buildings/${id}`, 300);
				t.eq(`${w}px id ${id} 중복 id`, (await askMeasure(t)).dupIds, []);
			}
		}
	});
});
