import type { C11Row } from "./c11Fixtures";
import type { C11Measure } from "./c11Measure";
import type { T } from "./makeT";

/** 목록 내용: 개수, 순서, 구분 칩, 계약 월, 면적, 금액, 건물명 자리표시 기호가 없음 */
export function c11CheckRowsContent(
	t: T,
	m: C11Measure,
	layout: "mobile" | "desktop",
	rows: C11Row[],
	label: string,
) {
	const list = layout === "mobile" ? m.lis : m.trs;
	t.eq(`${label} 행 개수`, list.length, rows.length);
	if (rows.length > 0) {
		t.eq(
			`${label} 구조(모바일 ul, 데스크톱 table)`,
			[m.ul, m.tables],
			layout === "mobile" ? [1, 0] : [0, 1],
		);
	} else {
		t.eq(`${label} 목록 없음(ul, table)`, [m.ul, m.tables], [0, 0]);
	}
	list.forEach((r, i) => {
		const got = r.texts.map((x) => x.t);
		const row = rows[i];
		t.eq(`${label} ${i + 1}행 칸 수`, got.length, 5);
		t.eq(
			`${label} ${i + 1}행 [구분 칩, 계약 월, 면적, 금액]`,
			[got[1], got[2], got[3], got[4]],
			[row?.[1], row?.[0], row?.[2], row?.[3]],
		);
		t.ok(
			`${label} ${i + 1}행 건물명이 있고 자리표시 기호(○△□◇☆)가 없음`,
			!!got[0] && !/[○△□◇☆]/.test(got[0]),
			got[0],
			"실제 이름 모양",
		);
		t.ok(
			`${label} ${i + 1}행 금액에 null, NaN이 없음`,
			!/null|undefined|NaN/.test(got[4] ?? ""),
			got[4],
			"null 없음",
		);
	});
}
