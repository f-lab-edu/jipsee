export type FooterHit = { text: string; y: number; b: number; hit: boolean };

/** 마지막 푸터 링크 가운데에서 가장 위에 있는 요소가 그 링크인지(바가 가리지 않는지) 측정함. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function c13MeasureFooterHit(): FooterHit[] {
	const footer = [...document.querySelectorAll("footer")].find(
		(e) => e.getClientRects().length > 0,
	);
	const links = [...(footer?.querySelectorAll("a") ?? [])].filter(
		(e) => e.getClientRects().length > 0,
	);
	return links.map((a) => {
		const r = a.getBoundingClientRect();
		const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
		return {
			text: (a.textContent ?? "").trim(),
			y: r.y,
			b: r.bottom,
			hit: !!el && (el === a || a.contains(el)),
		};
	});
}
