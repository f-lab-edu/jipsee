import type { LinksMeasure } from "./c5MeasureLinks";
import type { T } from "./makeT";

export function c5CheckLinkLayout(
	t: T,
	m: LinksMeasure,
	label: string,
	mobile: boolean,
) {
	const [a, b] = m.links;
	if (!a || !b) return;
	const pad = mobile ? "14px" : "16px";
	const padN = mobile ? 14 : 16;
	for (const l of m.links) {
		t.eq(`${label} ${l.text} padding 좌우`, [l.pl, l.pr], [pad, pad]);
		t.near(
			`${label} ${l.text} 라벨 왼쪽 = 링크 왼쪽 + padding`,
			l.label?.left,
			l.rect.x + padN,
			1,
		);
		t.near(
			`${label} ${l.text} 아이콘 오른쪽 = 링크 오른쪽 - padding`,
			l.svg?.r,
			l.rect.r - padN,
			1,
		);
		t.near(
			`${label} ${l.text} 아이콘 세로 가운데`,
			(l.svg?.y ?? Number.NaN) + (l.svg?.h ?? Number.NaN) / 2,
			l.rect.y + l.rect.h / 2,
			1,
		);
	}
	t.eq(
		`${label} 컨테이너 gap`,
		[a.parent?.rowGap, a.parent?.colGap],
		["8px", "8px"],
	);
	t.eq(`${label} 컨테이너의 링크 개수`, a.parent?.linkCount, 2);
	if (mobile) {
		t.near(`${label} 두 링크 top이 같음`, b.rect.y, a.rect.y, 0.5);
		t.near(
			`${label} 두 번째 링크 x = 첫 링크 오른쪽 + 8`,
			b.rect.x,
			a.rect.r + 8,
			0.5,
		);
		t.near(`${label} 두 링크 폭이 같음 (2열)`, b.rect.w, a.rect.w, 0.5);
	} else {
		t.near(`${label} 두 링크 left가 같음`, b.rect.x, a.rect.x, 0.5);
		t.near(
			`${label} 두 번째 top = 첫 링크 bottom + 8`,
			b.rect.y,
			a.rect.b + 8,
			0.5,
		);
		t.near(`${label} 두 링크 폭이 같음`, b.rect.w, a.rect.w, 0.5);
	}
}
