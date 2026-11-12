// S2 건물 상세 C12: 주변 전월세 거래 조건 확장 안내
// 기대값 출처: 설계 2절(상태표 "조건 확장 안내", 글자 크기, 주요 간격 안내 상자), 3절(문구), 7절(색 bg.warningWeak, fg.warningContrast), 9절(role="note", 아이콘 aria-hidden),
//   캔버스 S2(Mobile|Desktop)(Few|Zero)와 Dark* 보드의 조건 확장 안내 상자와 섹션 높이. 앱 값은 기대값 계산에 쓰지 않음

import { c12CheckNotice } from "../support/buildingDetail/c12CheckNotice";
import { c12CheckPosition } from "../support/buildingDetail/c12CheckPosition";
import { c12CheckSection } from "../support/buildingDetail/c12CheckSection";
import {
	C12_BODY,
	C12_ID2_WOLSE,
	C12_ID3_WOLSE,
	C12_NONE,
	C12_STATES,
} from "../support/buildingDetail/c12Fixtures";
import { c12Notices } from "../support/buildingDetail/c12Notices";
import { c12Total } from "../support/buildingDetail/c12Total";
import type { T } from "../support/buildingDetail/makeT";
import { measureNearbyDeals } from "../support/buildingDetail/measureNearbyDeals";
import type { Theme } from "../support/buildingDetail/tokens";
import { test } from "../support/test";
import { DESKTOP, MOBILE, MOBILE_COLUMN } from "../support/viewports";

const THEMES: Theme[] = ["light", "dark"];

// 케이스 id는 test 제목에 그대로 적음. 상태 케이스와 id 4 케이스는 레이아웃마다 하나씩이고 모양 케이스는 테마까지 나뉨
const LAYOUTS = [
	{
		name: "모바일",
		kind: "mobile",
		viewport: MOBILE,
		stateId: "C12-01",
		noneId: "C12-03",
		shapeIds: { light: "C12-05", dark: "C12-07" },
	},
	{
		name: "데스크톱",
		kind: "desktop",
		viewport: DESKTOP,
		stateId: "C12-02",
		noneId: "C12-04",
		shapeIds: { light: "C12-06", dark: "C12-08" },
	},
] as const;

const nearbyMeasure = (t: T) => t.page.evaluate(measureNearbyDeals);

for (const layout of LAYOUTS) {
	const { name, viewport } = layout;
	test.describe(`${viewport.width}x${viewport.height} light`, () => {
		test.use({ viewport, colorScheme: "light" });

		test(`${layout.stateId} ${name} id 1부터 5의 전세와 월세에서 건수가 3 미만일 때만 조건 확장 안내가 있고 제목이 건수와 같음`, async ({
			t,
		}) => {
			for (const st of C12_STATES) {
				t.issues.length = 0;
				await t.goto(`/buildings/${st.id}${st.q}`, 500);
				const m = await nearbyMeasure(t);
				const l = `${name} ${st.label}`;
				t.eq(`${l} 섹션이 보임`, m.found, true);
				t.eq(
					`${l} 조건 확장 안내 개수`,
					c12Notices(m).length,
					st.title ? 1 : 0,
				);
				t.eq(
					`${l} 본문 문구가 화면에 ${st.title ? "있음" : "없음"}`,
					m.bodyText.includes(C12_BODY),
					!!st.title,
				);
				t.eq(
					`${l} 섹션 안 note 개수(확정일자 포함)`,
					c12Total(m),
					st.title ? 2 : 1,
				);
				if (st.title) {
					t.eq(`${l} 건수 줄 건수`, m.summary?.count.t, `${st.count ?? 0}건`);
					t.eq(`${l} 안내 제목`, c12Notices(m)[0]?.texts[0]?.t, st.title);
					if (st.count) {
						t.eq(
							`${l} 안내 제목이 건수 줄 건수와 같은 건수`,
							st.title,
							`조건에 맞는 거래 ${m.summary?.count.t}`,
						);
					}
				}
				t.eq(`${l} 중복 id 없음`, m.dupIds, []);
				t.eq(`${l} 콘솔 오류 없음`, t.issues.slice(), []);
			}
		});

		test(`${layout.noneId} ${name} id 4는 위치 정보 없음 안내만 있고 조건 확장 안내, 건수 줄, 목록이 없음`, async ({
			t,
		}) => {
			for (const q of ["", "?type=wolse"]) {
				await t.goto(`/buildings/4${q}`, 500);
				const m = await nearbyMeasure(t);
				const l = `${name} id 4${q ? " 월세" : ""}`;
				t.eq(`${l} 조건 확장 안내 개수`, c12Notices(m).length, 0);
				t.eq(`${l} note 개수(위치 정보 없음 안내만)`, c12Total(m), 1);
				t.eq(
					`${l} 안내 문구`,
					(m.notes ?? [])[0]?.texts.map((x) => x.t),
					["이 건물은 위치 정보가 없어서 주변 거래를 보여드릴 수 없어요"],
				);
				t.eq(
					`${l} 조건 확장 문구가 화면에 없음`,
					[
						m.bodyText.includes(C12_BODY),
						m.bodyText.includes(C12_NONE),
						m.bodyText.includes("조건에 맞는 거래"),
					],
					[false, false, false],
				);
			}
		});
	});
}

// 모양 확인 대상: id 2와 id 3의 전세, id 3의 월세 (섹션 크기가 있는 전세 상태와 id 3 월세)
const SHAPE_STATES = C12_STATES.filter(
	(s) => (s.secM !== undefined && s.q === "") || (s.id === 3 && s.q !== ""),
);

for (const theme of THEMES) {
	for (const layout of LAYOUTS) {
		const { name, kind, viewport } = layout;
		test.describe(`${viewport.width}x${viewport.height} ${theme}`, () => {
			test.use({ viewport, colorScheme: theme });

			test(`${layout.shapeIds[theme]} ${name} ${theme} id 3 전세와 월세, id 2의 조건 확장 안내 모양, 색, 위치, 섹션 크기가 설계와 같음`, async ({
				t,
			}) => {
				for (const st of SHAPE_STATES) {
					await t.goto(`/buildings/${st.id}${st.q}`, 500);
					const m = await nearbyMeasure(t);
					const l = `${name} ${theme} ${st.label}`;
					c12CheckNotice(t, m, kind, st, l);
					c12CheckPosition(t, m, kind, st, l);
					c12CheckSection(t, m, kind, st, l);
				}
			});
		});
	}
}

test.describe(`${MOBILE.width}x${MOBILE.height} dark`, () => {
	test.use({ viewport: MOBILE, colorScheme: "dark" });

	test("C12-09 id 2의 월세에서도 0건 안내 제목이 같고 모바일 다크에서 id 3 월세의 색이 다크 토큰임", async ({
		t,
	}) => {
		await t.goto("/buildings/2?type=wolse", 500);
		const m = await nearbyMeasure(t);
		c12CheckNotice(t, m, "mobile", C12_ID2_WOLSE, "모바일 다크 id 2 월세");
		await t.goto("/buildings/3?type=wolse", 500);
		const m3 = await nearbyMeasure(t);
		c12CheckNotice(t, m3, "mobile", C12_ID3_WOLSE, "모바일 다크 id 3 월세");
	});
});

test.describe("320x700 light", () => {
	test.use({ viewport: { width: 320, height: 700 }, colorScheme: "light" });

	test("C12-10 320px에서 id 2와 id 3 전세, 월세의 조건 확장 안내가 가로 스크롤 없이 섹션 안에 한 줄씩 들어옴", async ({
		t,
	}) => {
		for (const st of C12_STATES.filter((s) => s.title)) {
			await t.goto(`/buildings/${st.id}${st.q}`, 400);
			const m = await nearbyMeasure(t);
			const l = `${st.label} 320`;
			const nan = Number.NaN;
			t.ok(
				`${l} 가로 스크롤`,
				m.scrollW <= m.vw,
				m.scrollW,
				`문서 폭 ≤ ${m.vw}`,
			);
			t.near(`${l} 섹션 w`, m.section?.w, 320 - 2 * MOBILE_COLUMN.x, 0.5);
			const n = c12Notices(m)[0];
			t.ok(
				`${l} 안내 상자가 섹션 안`,
				!!n &&
					n.x >= (m.section?.x ?? nan) + 15.5 &&
					n.r <= (m.section?.r ?? nan) - 15.5,
				[n?.x, n?.r],
				"섹션 안",
			);
			t.near(`${l} 상자 w(320 - 32)`, n?.w, 288, 0.5);
			t.ok(
				`${l} 문구가 상자 안쪽 오른쪽 padding 안에 들어옴`,
				!!n && n.texts.every((x) => x.r <= n.r - 16 + 0.5),
				n?.texts.map((x) => x.r),
				`≤ ${(n?.r ?? nan) - 16}`,
			);
			t.near(`${l} 상자 높이 70(한 줄씩)`, n?.h, 70, 0.5);
			t.eq(
				`${l} 제목과 본문이 한 줄씩`,
				n?.texts.map((x) => x.h <= 20),
				[true, true],
			);
		}
	});
});
